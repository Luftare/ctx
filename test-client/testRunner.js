const testCases = document.querySelector('.test-cases');
const testRecaps = document.querySelector('.test-recaps');
const summaryStatus = document.querySelector('.summary-status');

const RUNNING = 'running';
const FAILED = 'failed';
const PASSED = 'passed';

resemble.outputSettings({
  errorColor: {
    red: 255,
    green: 0,
    blue: 0,
  },
  errorType: 'movement',
  transparency: 1,
  useCrossOrigin: false,
  outputDiff: true,
});

function drawGrid(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillRect(center.x - 0.5, 0, 1, canvasSize.y);
  ctx.fillRect(0, center.y - 0.5, canvasSize.x, 1);
}

function updateSummaryStatus(tests) {
  const processedTestCount = tests.filter(
    test => test.status === PASSED || test.status === FAILED
  ).length;
  const passedTestCount = tests.filter(test => test.status === PASSED).length;
  const totalTestCount = tests.length;
  const allTestsProcessed = processedTestCount === totalTestCount;

  if (allTestsProcessed) {
    const allTestsPassed = passedTestCount === totalTestCount;
    if (allTestsPassed) {
      summaryStatus.classList.add('summary-status--pass');
      summaryStatus.innerHTML = `${passedTestCount} / ${totalTestCount}: PASS`;
    } else {
      summaryStatus.classList.add('summary-status--fail');
      summaryStatus.innerHTML = `${passedTestCount} / ${totalTestCount}: FAIL`;
    }
  } else {
    summaryStatus.innerHTML = `RUNNING...`;
  }
}

import('/Paint.js').then(({ Paint }) => runAllTests(Paint));

function updateTestSnapshot(testIndex, updatedImageDataUrl) {
  return new Promise(resolve => {
    fetch('snapshots', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testIndex,
        updatedImageDataUrl,
      }),
    }).then(resolve);
  });
}

function getImagesMatchData(dataUrlA, dataUrlB) {
  return new Promise((resolve, reject) => {
    resemble(dataUrlA)
      .compareTo(dataUrlB)
      .ignoreColors()
      .onComplete(({ rawMisMatchPercentage, getImageDataUrl, error }) => {
        if (error) {
          reject(null);
          return;
        }
        resolve({
          difference: rawMisMatchPercentage,
          doMatch: rawMisMatchPercentage < 0.7,
          diffImageUrl: getImageDataUrl(),
        });
      });
  });
}

function runAllTests(Paint) {
  testCases.innerHTML = '';
  testRecaps.innerHTML = '';

  summaryStatus.classList.remove('summary-status--pass');
  summaryStatus.classList.remove('summary-status--fail');

  tests.forEach((test, testIndex) => {
    test.status = RUNNING;
    const testId = `test-${testIndex}`;
    const container = document.createElement('div');
    container.classList.add('case');
    container.id = testId;

    let testArgumentsHTML = '<table class="case__arguments">';
    const testKeys = [];
    const propsObject = test.arguments[0];
    for (let key in propsObject) {
      const value = propsObject[key];
      if (propsObject.hasOwnProperty(key)) {
        testKeys.push(key);
        testArgumentsHTML += `
          <tr class="case__argument">
            <td class="case__argument-key">${key}</td>
            <td class="case__argument-value">${JSON.stringify(value)}</td>
          </tr>`;
      }
    }
    testArgumentsHTML += '</table>';

    container.innerHTML = `
        <div class="case__overview">
          <div class="case__title">#${testIndex} ${test.description}:</div>
          <div class="case__arguments">
            ${testArgumentsHTML}
          </div>
          <button class="case__update-snapshot" hidden>Update snapshot</button>
        </div>
        <div>
          <div>Output</div>
          <canvas class="case__canvas"></canvas>
        </div>
        <div>
          <div>Snapshot</div>
          <img class="case__snapshot" style="width: ${
      canvasSize.x
      }px; height: ${canvasSize.y}px;"/>
        </div>
        <div>
          <div>Difference: <span class="case__snapshot-difference-percentage"></span></div>
          <img class="case__snapshot-diff" style="width: ${
      canvasSize.x
      }px; height: ${canvasSize.y}px;"/>
        </div>
    `;

    const recap = document.createElement('a');
    recap.href = `#${testId}`;
    recap.classList.add('test-recap');
    recap.innerHTML = `#${testIndex} <b>${
      test.description
      }</b>: ({ ${testKeys.join(', ')} })`;

    testCases.appendChild(container);
    testRecaps.appendChild(recap);

    const canvas = container.querySelector('.case__canvas');
    const updateSnapshotButton = container.querySelector(
      '.case__update-snapshot'
    );
    const snapshot = container.querySelector('.case__snapshot');
    const snapshotDiff = container.querySelector('.case__snapshot-diff');
    const snapshotDiffPercentage = container.querySelector(
      '.case__snapshot-difference-percentage'
    );

    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;

    updateSnapshotButton.addEventListener('click', () => {
      updateTestSnapshot(testIndex, canvas.toDataURL()).then(() => runAllTests(Paint));
    });

    drawGrid(canvas);

    test.run(canvas, Paint);

    fetch(`snapshots/${testIndex}`)
      .then(res => res.text())
      .then(snapshotImageDataUrl => {
        if (!snapshotImageDataUrl) {
          updateSnapshotButton.hidden = false;
          updateSnapshotButton.innerHTML = 'Add snapshot';
          snapshot.classList.add('case__snapshot--missing');
          test.status = FAILED;
          updateSummaryStatus(tests);
          return;
        }

        snapshot.src = snapshotImageDataUrl;

        const localImageDataUrl = canvas.toDataURL();

        getImagesMatchData(localImageDataUrl, snapshotImageDataUrl)
          .then(({ doMatch, diffImageUrl, difference }) => {
            snapshotDiffPercentage.innerHTML = `${Math.floor(difference * 100) /
              100}%`;
            snapshotDiff.src = diffImageUrl;
            if (doMatch) {
              container.classList.add('case--unchanged-snapshot');
              recap.classList.add('test-recap--success');
              test.status = PASSED;
            } else {
              test.status = FAILED;
              container.classList.add('case--changed-snapshot');
              recap.classList.add('test-recap--fail');
              updateSnapshotButton.hidden = false;
            }
            updateSummaryStatus(tests);
          })
          .catch(() => { });
      });
  });
}
