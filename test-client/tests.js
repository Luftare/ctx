const image = document.querySelector('.test-image');
const canvasSize = { x: 300, y: 300 };
const center = { x: canvasSize.x / 2, y: canvasSize.y / 2 };

const tests = [
  {
    description: 'image',
    arguments: [
      {
        position: center,
        image,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'alpha',
    arguments: [
      {
        position: center,
        image,
        alpha: 0.5,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'scale',
    arguments: [
      {
        position: center,
        image,
        scale: 2,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'anchor',
    arguments: [
      {
        position: center,
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        image,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'angle',
    arguments: [
      {
        position: center,
        angle: Math.PI * 0.25,
        image,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'angle + anchor + scale + alpha',
    arguments: [
      {
        position: center,
        anchor: {
          x: 0.5,
          y: 0.5,
        },
        angle: Math.PI * 0.25,
        scale: 1.5,
        alpha: 0.5,
        image,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.image(...this.arguments);
    },
  },
  {
    description: 'rect + fill',
    arguments: [
      {
        position: center,
        width: 100,
        height: 50,
        fill: 'black',
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.rect(...this.arguments);
    },
  },
  {
    description: 'rect + stroke + scale line width',
    arguments: [
      {
        position: center,
        width: 50,
        height: 50,
        scale: 2,
        stroke: 'black',
        lineWidth: 5,
        scaleLineWidth: true,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.rect(...this.arguments);
    },
  },
  {
    description: 'rect + stroke + fill + angle',
    arguments: [
      {
        position: center,
        width: 100,
        height: 50,
        stroke: 'black',
        fill: 'green',
        scale: 2,
        lineWidth: 5,
        angle: Math.PI * 0.3,
        anchor: { x: 0.5, y: 0.5 },
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.rect(...this.arguments);
    },
  },
  {
    description: 'path + stroke',
    arguments: [
      {
        points: [
          { x: 10, y: 10 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        lineWidth: 3,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'path + stroke + fill + close path',
    arguments: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        closePath: true,
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'path + stroke + fill + close path',
    arguments: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        closePath: true,
        anchor: { x: 0.5, y: 0.5 },
        angle: 0.5,
        position: center,
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'path + stroke + fill + close path',
    arguments: [
      {
        points: [
          { x: 0, y: 0 },
          { x: 200, y: 200 },
          { x: 40, y: 140 },
          { x: 160, y: 70 },
        ],
        stroke: 'black',
        closePath: true,
        anchor: { x: 0.5, y: 0.5 },
        angle: 0.5,
        position: center,
        scale: 0.5,
        scaleLineWidth: true,
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.path(...this.arguments);
    },
  },
  {
    description: 'circle',
    arguments: [
      {
        position: center,
        radius: 55,
        stroke: 'black',
        fill: 'red',
        lineWidth: 5,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.circle(...this.arguments);
    },
  },
  {
    description: 'circle',
    arguments: [
      {
        position: center,
        radius: 55,
        stroke: 'black',
        fill: 'red',
        scale: 0.5,
        lineWidth: 5,
        scaleLineWidth: true,
      },
    ],
    run(canvas) {
      const paint = new Paint(canvas);
      paint.circle(...this.arguments);
    },
  },
];
