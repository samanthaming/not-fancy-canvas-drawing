new Vue({
  el: '#app',
  data: {
    canvasTop: 0,
    canvasLeft: 0,
    lastX: 0,
    lastY: 0,
    lineWidth: 10,
    isDrawing: false,
    isEraser: false,
    selectedColor: '#000000',
    colors: [
      '#000000',
      '#FFDD57',
      '#4286f4',
      '#23d160',
      '#FF8600',
      '#ff3860',
    ],
  },
  computed: {
    cursorStyle() {
      return {
        width: `${this.lineWidth}px`,
        height: `${this.lineWidth}px`,
        background: this.selectedColor,
      };
    }
  },
  methods: {
    draw(e) {
      if (!this.isDrawing) {
        return;
      }

      const {canvas, ctx} = this.getCanvas();

      ctx.strokeStyle = this.selectedColor;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = this.lineWidth;

      ctx.beginPath();
      // start from
      ctx.moveTo(this.lastX, this.lastY);

      // go to
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      // 1. Update start point to where mouse is unpressed
      //    Otherwise it'd be always 0,0
      [this.lastX, this.lastY] = [e.offsetX, e.offsetY]
    },
    onMouseDown(e) {
      this.isDrawing = true;
      // 2. set the drawing point to where the mouse down is pressed
      [this.lastX, this.lastY] = [e.offsetX, e.offsetY]
    },
    onMouseUp() {
      this.isDrawing = false;
    },
    onMouseMove(e) {
      this.draw(e);

      const x = e.offsetX + this.canvasLeft;
      const y = e.offsetY + this.canvasTop;
      const cursor = this.$refs.cursor;

      cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    },
    onMouseOut() {
      this.isDrawing = false;
    },
    onMouseEnter() {
      const {canvas} = this.getCanvas();
      [this.canvasTop, this.canvasLeft] = [canvas.offsetTop, canvas.offsetLeft]
    },
    selectColor(color) {
      this.selectedColor = color;
      this.isEraser = false;
    },
    selectEraser() {
      this.selectedColor = '#FFFFFF';
      this.isEraser = true;
    },
    selectTrash() {
      this.isEraser = false;
      const {canvas, ctx} = this.getCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    getCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');

      return { canvas, ctx };
    },
  },
})
