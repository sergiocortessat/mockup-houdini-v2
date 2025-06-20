// @ts-nocheck
import { useEffect } from 'react';

const useCanvasCursor = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  enabled: boolean
) => {
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    let ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let f: any;
    let e = 0;
    let pos: any = {};
    let lines: any[] = [];
    const E = {
      debug: true,
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.25,
      tension: 0.98,
    };

    function Node() {
      this.x = 0;
      this.y = 0;
      this.vy = 0;
      this.vx = 0;
    }

    function n(e: any) {
      this.init(e || {});
    }
    n.prototype = {
      init: function (e: any) {
        this.phase = e.phase || 0;
        this.offset = e.offset || 0;
        this.frequency = e.frequency || 0.001;
        this.amplitude = e.amplitude || 1;
      },
      update: function () {
        this.phase += this.frequency;
        return this.offset + Math.sin(this.phase) * this.amplitude;
      },
      value: function () {
        return e;
      },
    };

    function Line(e: any) {
      this.init(e || {});
    }
    Line.prototype = {
      init: function (e: any) {
        this.spring = e.spring + 0.1 * Math.random() - 0.02;
        this.friction = E.friction + 0.01 * Math.random() - 0.002;
        this.nodes = [];
        for (let n = 0; n < E.size; n++) {
          const t = new Node();
          t.x = pos.x;
          t.y = pos.y;
          this.nodes.push(t);
        }
      },
      update: function () {
        let e = this.spring;
        let t = this.nodes[0];
        t.vx += (pos.x - t.x) * e;
        t.vy += (pos.y - t.y) * e;
        for (let i = 0, a = this.nodes.length; i < a; i++) {
          t = this.nodes[i];
          if (i > 0) {
            const n = this.nodes[i - 1];
            t.vx += (n.x - t.x) * e;
            t.vy += (n.y - t.y) * e;
            t.vx += n.vx * E.dampening;
            t.vy += n.vy * E.dampening;
          }
          t.vx *= this.friction;
          t.vy *= this.friction;
          t.x += t.vx;
          t.y += t.vy;
          e *= E.tension;
        }
      },
      draw: function () {
        let n = this.nodes[0].x;
        let i = this.nodes[0].y;
        ctx.beginPath();
        ctx.moveTo(n, i);
        for (let a = 1, o = this.nodes.length - 2; a < o; a++) {
          const e = this.nodes[a];
          const t = this.nodes[a + 1];
          n = 0.5 * (e.x + t.x);
          i = 0.5 * (e.y + t.y);
          ctx.quadraticCurveTo(e.x, e.y, n, i);
        }
        const e = this.nodes[this.nodes.length - 2];
        const t = this.nodes[this.nodes.length - 1];
        ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
        ctx.stroke();
        ctx.closePath();
      },
    };

    function onMousemove(e: any) {
      function o() {
        lines = [];
        for (let e = 0; e < E.trails; e++) {
          lines.push(new Line({ spring: 0.4 + (e / E.trails) * 0.025 }));
        }
      }
      function c(e: any) {
        if (e.touches) {
          pos.x = e.touches[0].pageX;
          pos.y = e.touches[0].pageY;
        } else {
          pos.x = e.clientX;
          pos.y = e.clientY;
        }
        e.preventDefault();
      }
      function l(e: any) {
        if (e.touches && e.touches.length === 1) {
          pos.x = e.touches[0].pageX;
          pos.y = e.touches[0].pageY;
        }
      }
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('touchstart', onMousemove);
      document.addEventListener('mousemove', c);
      document.addEventListener('touchmove', c);
      document.addEventListener('touchstart', l);
      c(e);
      o();
      render();
    }

    function render() {
      if ((ctx as any).running) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ',50%,50%,0.2)';
        ctx.lineWidth = 1;
        for (let t = 0; t < E.trails; t++) {
          const e = lines[t];
          e.update();
          e.draw();
        }
        (ctx as any).frame++;
        window.requestAnimationFrame(render);
      }
    }

    function resizeCanvas() {
      ctx.canvas.width = window.innerWidth - 20;
      ctx.canvas.height = window.innerHeight;
    }

    // Setup
    (ctx as any).running = true;
    (ctx as any).frame = 1;
    f = new n({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });
    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('touchstart', onMousemove);
    document.body.addEventListener('orientationchange', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('focus', () => {
      if (!(ctx as any).running) {
        (ctx as any).running = true;
        render();
      }
    });
    window.addEventListener('blur', () => {
      (ctx as any).running = true;
    });
    resizeCanvas();

    // Cleanup
    return () => {
      (ctx as any).running = false;
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('touchstart', onMousemove);
      document.body.removeEventListener('orientationchange', resizeCanvas);
      window.removeEventListener('resize', resizeCanvas);
      // Note: The following listeners are anonymous, so can't be removed directly
      // window.removeEventListener('focus', ...);
      // window.removeEventListener('blur', ...);
    };
  }, [canvasRef, enabled]);
};

export default useCanvasCursor;
