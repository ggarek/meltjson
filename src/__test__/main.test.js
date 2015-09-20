import test from 'tape';
import melt from '../main';

//test('melt a', test => {

  test('object with simple paths', assert => {
    const source = {
      armor_part: 'chest',
      armor_gender: 'male',
      armor_rarity: 5
    };

    // TODO: how to simplify scalar property extraction to { key: path }.
    // JSON path return array for every selector
    const shape = {
      part: '$.armor_part',
      gender: '$.armor_gender',
      rarity: '$.armor_rarity'
    };

    const melted = melt(source, shape);
    const expected = {
      part: 'chest',
      rarity: 5,
      gender: 'male'
    };

    assert.deepEqual(melted, expected);
    assert.end();
  });

  test('many props to single map', assert => {
    const source = {
      resistance_fire: 3,
      resistance_water: 5,
      resistance_earth: -1
    };

    const shape = {
      resistance: {
        path: ['$.resistance_fire', '$.resistance_water', '$.resistance_earth'],
        transform: (fire, water, earth) => {
          return { fire, water, earth };
        }
      }
    };

    const expected = {
      resistance: {
        fire: 3,
        water: 5,
        earth: -1
      }
    };

    assert.deepEqual(melt(source, shape), expected);
    assert.end();
  });

  test('array to single map', assert => {
    const source = {
      skills: [
        {
          name: 'increase attack',
          level: 3
        },
        {
          name: 'defense up',
          level: 1
        },
        {
          name: 'guts',
          level: 3
        }
      ]
    };

    const shape = {
      skills: {
        path: '$.skills',
        transform: (skills) => {
          return skills.reduce((result, next) => {
            result[next.name] = next.level;
            return result;
          }, {});
        }
      }
    };

    const expected = {
      skills: {
        'defense up': 1,
        'increase attack': 3,
        'guts': 3
      }
    };

    assert.deepEqual(melt(source, shape), expected);
    assert.end();
  });

  //test.end();
//});