let sampleData = {x: [], y: [], data: {}};

let s = 'abcdefghiklmnopq'.toUpperCase();
sampleData.x = s.split('');
sampleData.y = s.split('');

for (let c1 of s) {
  for (let c2 of s) {
    sampleData.data[`${c1}-${c2}`] = {
      x: c1,
      y: c2,
      type: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
      value: Math.random() > .92 ? 1 : 0,
    }
  }
}

export default sampleData;

