import tap from 'tap';
import Offset from '../src/offset.esm.js';
import Edge from '../src/Edge.esm.js';

function prec(arr, precision) {
  if (typeof arr[0] === 'number') {
    return arr.map(function(n) { return parseFloat(n.toFixed(precision));});
  }
  for (var i = 0; i < arr.length; i++) {
    arr[i] = prec(arr[i], precision);
  }
  return arr;
}

// CCW
var points = [
  [0,0], [0,100],
  [100,100], [100,0], [0,0]
];
var x = -10;


tap.test('polygon.offset', function(t) {

  t.test('edge', function(t) {
    var e = new Edge([0,0], [0,5]);
    t.strictSame(e.current, [0, 0], 'current');
    t.strictSame(e.next, [0, 5], 'next');
    t.strictSame(e._inNormal, [ -1, 0], 'inwards normal');
    t.strictSame(e._outNormal, [1, 0],  'outwards normal');
    t.end();
  });

  t.test('data', function(t) {
    t.throws(function() { return new Offset(1); }, 'throws at invalid input');
    t.strictSame(new Offset(points).vertices, points, 'read');
    //t.strictSame(new Offset(points).vertices, points, 'stored');
    t.end();
  });


  t.test('margin', function(t) {
    t.strictSame(prec(new Offset(points).arcSegments(3).margin(5), 3), [[[-5,0],[-5,100],[-4.33,101.16],[-4.33,102.5],[-3.17,103.17],[-2.5,104.33],[-1.16,104.33],[0,105],[100,105],[101.16,104.33],[102.5,104.33],[103.17,103.17],[104.33,102.5],[104.33,101.16],[105,100],[105,0],[104.33,-1.16],[104.33,-2.5],[103.17,-3.17],[102.5,-4.33],[101.16,-4.33],[100,-5],[0,-5],[-1.16,-4.33],[-2.5,-4.33],[-3.17,-3.17],[-4.33,-2.5],[-4.33,-1.16],[-5,0]]]);
    t.strictSame(new Offset(points).arcSegments(1).margin(5), [[[-5,0],[-5,100],[0,100],[0,105],[100,105],[100,100],[105,100],[105,0],[100,0],[100,-5],[0,-5],[0,0],[-5,0]]], 'normal');
    t.strictSame(new Offset(points).arcSegments(0).margin(5), [[[-5,0],[-5,100],[0,100],[0,105],[100,105],[100,100],[105,100],[105,0],[100,0],[100,-5],[0,-5],[0,0],[-5,0]]], '0 additional segs');
    t.strictSame(new Offset(points).margin(0), points, 'zero');
    t.end();
  });


  t.test('padding', function(t) {
    t.strictSame(new Offset(points).arcSegments(5).padding(10), [[[[10,10],[10,90],[90,90],[90,10],[10,10]]]]);
    t.strictSame(new Offset(points).padding(5), [[[[5,5],[5,95],[95,95],[95,5],[5,5]]]], 'normal');
    t.strictSame(new Offset(points).padding(0), points, 'zero');
    t.end();
  });

  t.test('line', function(t) {
    t.strictSame(new Offset(points.slice(1, 3)).arcSegments(2).offsetLine(5), [ [ [ 0, 95 ], [ 0, 105 ], [ 100, 105 ], [ 100, 95 ], [ 0, 95 ] ] ], 'segment');
    t.strictSame(new Offset(points.slice(1,3)).arcSegments(2).offsetLine(0), points.slice(1, 3), 'segment');
    t.strictSame(new Offset(points.slice(1)).arcSegments(2).offsetLine(5), Offset.orientRings([[[0,-5],[100,-5],[100,0],[105,0],[105,100],[100,100],[100,105],[0,105],[0,95],[95,95],[95,5],[0,5],[0,-5]]]) , 'polyline');
    t.strictSame(new Offset(points.slice(1)).offsetLine(0), points.slice(1), 'zero');
    t.end();
  });

  t.end();
});
