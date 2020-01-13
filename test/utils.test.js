import tap from 'tap';
import * as Utils from '../src/utils.esm.js';

tap.test('orientRings', function(t) {

  t.test('empty', function(t){
    Utils.orientRings([]);
    t.end();
  });


  t.end();
});
