import { Bezier } from "../../src/bezier.js";

describe(`Cubic bezier`, () => {
  describe(`from constructor`, () => {
    const b = new Bezier(0, 0, 0, 1, 1, 1, 1, 0);

    test(`serializes correctly`, () => {
      expect(b.toString()).toEqual("[0/0, 0/1, 1/1, 1/0]");
    });

    test(`has the correct approximate length`, () => {
      expect(b.length()).toBeCloseTo(2, 10);
    });

    test(`has the expected derivative points`, () => {
      expect(b.dpoints).toEqual([
        [
          { x: 0, y: 3 },
          { x: 3, y: 0 },
          { x: 0, y: -3 },
        ],
        [
          { x: 6, y: -6 },
          { x: -6, y: -6 },
        ],
        [{ x: -12, y: 0 }],
      ]);
      expect(b.derivative(0)).toEqual({ t: 0, x: 0, y: 3 });
      expect(b.derivative(0.5)).toEqual({ t: 0.5, x: 1.5, y: 0 });
      expect(b.derivative(1)).toEqual({ t: 1, x: 0, y: -3 });
    });

    test(`has the expected normals`, () => {
      expect(b.normal(0)).toEqual({ t: 0, x: -1, y: 0 });
      expect(b.normal(0.5)).toEqual({ t: 0.5, x: -0, y: 1 });
      expect(b.normal(1)).toEqual({ t: 1, x: 1, y: 0 });
    });

    test(`has the correct inflection point`, () => {
      expect(b.inflections()).toEqual([]);
    });

    test(`has the correct axis-aligned bounding box`, () => {
      expect(b.bbox()).toEqual({
        x: { min: 0, mid: 0.5, max: 1, size: 1 },
        y: { min: 0, mid: 0.375, max: 0.75, size: 0.75 },
      });
    });
  });

  describe(`complex cubic`, () => {
    const b = new Bezier(0, 0, 1, 0.25, 0, 1, 1, 0);
    test(`has the correct inflection point`, () => {
      expect(b.inflections()).toEqual([0.8, 0.5]);
    });
  });

  describe(`difficult intersection`, () => {
    var tt1 = new Bezier(20.294698715209961, 20.116849899291992,
        26.718513488769531, 28.516490936279297,
        33.345268249511719, 37.4105110168457,
        36.240531921386719,37.736736297607422);
    var tt2 = new Bezier(43.967803955078125, 30.767040252685547,
        43.967803955078125, 31.771089553833008,
        35.013500213623047, 32.585041046142578,
        23.967803955078125, 32.585041046142578);

    test(`should find two intersections`, () => {
      var intersections = tt1.intersects(tt2);
      expect(intersections.length).toEqual(2);
    });

    test(`should find reduction`, () => {
      var ttReduced = tt1.reduce();
      expect(ttReduced.length).toEqual(4);
    });
  });

  describe(`from point set`, () => {
    const M = { x: 200 / 3, y: 100 / 3 };
    const pts = [{ x: 0, y: 0 }, M, { x: 100, y: 100 }];

    test(`has the correct midpoint using default t value`, () => {
      const b = Bezier.cubicFromPoints(pts[0], pts[1], pts[2]);
      const midpoint = b.get(0.5);
      expect(M.x).toBeCloseTo(midpoint.x, 12);
      expect(M.y).toBeCloseTo(midpoint.y, 12);
    });

    test(`has the correct t=0.25 point using t=0.25 as reference`, () => {
      const t = 0.25;
      const b = Bezier.cubicFromPoints(pts[0], pts[1], pts[2], t);
      const quarterpoint = b.get(t);
      expect(M.x).toBeCloseTo(quarterpoint.x, 12);
      expect(M.y).toBeCloseTo(quarterpoint.y, 12);
    });
  });
});
