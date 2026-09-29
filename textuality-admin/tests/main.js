import assert from 'assert';
import { formatEventTime } from '/imports/utils/format-event-time';

describe('textuality-admin', function () {
  it('package.json has correct name', async function () {
    const { name } = await import('../package.json');
    assert.strictEqual(name, 'textuality-admin');
  });

  it('formats event times in the configured time zone', function () {
    const date = new Date('2026-09-29T23:50:00Z');

    assert.strictEqual(formatEventTime(date), '7:50 PM');
  });

  if (Meteor.isClient) {
    it('client is not server', function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it('server is not client', function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
