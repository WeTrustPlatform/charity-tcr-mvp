const {
  testSetup,
  paddedBytes,
  buildBytesInput,
} = require('./utils');

const StakingContract = embark.require('Embark/contracts/TimeLockedStaking');


testSetup(() => {});

// block.timestamp can vary
// the whole suite might take up to 5 minutes
// the unlocked time calculated by blockchain
// should be under 5 minutes difference
const TOLERANCE_IN_SECS = 60 * 5;

// Matrix:
// [
// [testName1, timeSignal1, voteSignal1, expectedOutput1],
// [testName2, timeSignal2, voteSignal2, expectedOutput2],
// ]
const runMatrix = (matrix) => {
  for (const testCase of matrix) {
    it(testCase[0], async () => {
      const input = buildBytesInput(testCase[1], testCase[2]);
      const timeLocked = await StakingContract.methods.getUnlockedAtSignal(input).call();
      assert.ok(
        Math.abs(timeLocked - testCase[3]) < TOLERANCE_IN_SECS,
        `Expected ${testCase[3]} vs. Actual ${timeLocked}`,
      );
    });
  }
};

// all in seconds
const now = Math.floor(Date.now() / 1000);
const oneDay = 24 * 60 * 60;
const tomorrow = now + oneDay;
const oneYearFromNow = now + 365 * oneDay;
const moreThanAYearFromNow = oneYearFromNow + oneDay;

contract('Test getUnlockedAtSignal matrix of happy cases', async () => {
  runMatrix([
    ['all 0s', '0', '0', '0'],
    ['only vote signal', '0', '1', '0'],
    ['only time signal', '1', '0', '1'],
    ['both time and vote signals', '1', '2', '1'],
    ['now with vote', now, '0', now],
    ['tomorrow with vote', tomorrow, '0', tomorrow],
    ['one year from now with vote', oneYearFromNow, '0', oneYearFromNow],
    ['now without vote', now, '0', now],
    ['tomorrow without vote', tomorrow, '0', tomorrow],
    ['one year from now without vote', oneYearFromNow, '0', oneYearFromNow],
  ]);
});

contract('Test getUnlockedAtSignal edge cases', () => {
  it('should return 0 when input is empty', async () => {
    const timeLocked = await StakingContract.methods.getUnlockedAtSignal('0x').call();
    assert.equal(timeLocked, 0);
  });

  it('should work when vote signal is empty', async () => {
    const dataBytes = paddedBytes('0').concat(paddedBytes('1'));
    const input = web3.utils.bytesToHex(dataBytes);
    const timeLocked = await StakingContract.methods.getUnlockedAtSignal(input).call();
    assert.equal(timeLocked, 1);
  });

  it('should work when vote signal is padded overflow', async () => {
    const input = buildBytesInput('1', '1', [32, 64]);
    const timeLocked = await StakingContract.methods.getUnlockedAtSignal(input).call();
    assert.equal(timeLocked, 1);
  });

  it('should work when vote signal is a huge number > uint256', async () => {
    const input = buildBytesInput('1', web3.utils.padRight('1', 64), [32, 128]);
    const timeLocked = await StakingContract.methods.getUnlockedAtSignal(input).call();
    assert.equal(timeLocked, 1);
  });

  it('should return 1 year max', async () => {
    const input = buildBytesInput(moreThanAYearFromNow, '0');
    const timeLocked = await StakingContract.methods.getUnlockedAtSignal(input).call();
    assert.ok(
      Math.abs(timeLocked - oneYearFromNow) < TOLERANCE_IN_SECS,
      `Expected ${oneYearFromNow} vs. Actual ${timeLocked}`,
    );
  });
});

contract('Test unstake when there is timelocked', async () => {
  it('should throw when unstake', async () => {
    // stake first
    //
  });
});
