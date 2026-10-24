// The server's start and stop: the refresh timer runs while the server is up and not after close(). Time is faked
// with the test runner's mock timers, so nothing sleeps. The HTTP server is a stand-in that records its calls, so
// no port is opened.
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import * as server from '../src/server.ts'
import { openStore, type Store } from '../src/store/index.ts'

const fixture = new URL('./fixtures/usgs/recorded-2026-10-22.geojson', import.meta.url).pathname

// A real in-memory store that counts the refreshes (each one upserts) and the closes.
function countingStore() {
  const real = openStore(':memory:')
  const counts = { upserts: 0, closes: 0 }
  const store: Store = {
    ...real,
    upsertEvents(quakes) { counts.upserts++; real.upsertEvents(quakes) },
    close() { counts.closes++; real.close() },
  }
  return { store, counts }
}

// Stands in for `http.Server`: listens at once, and counts the closes.
function fakeHttpServer() {
  const calls = { listen: 0, close: 0 }
  const fake: any = {
    once() {},
    listen(_port: number, _host: string, done: () => void) { calls.listen++; done() },
    close(done: () => void) { calls.close++; done() },
    closeAllConnections() {},
  }
  return { fake, calls }
}

test('close() stops the listener, clears the refresh timer and closes the store', async () => {
  mock.timers.enable({ apis: ['setInterval'] })
  try {
    const { store, counts } = countingStore()
    const http = fakeHttpServer()
    const running = await (server as any).start(store, {
      port: 0, feedFile: fixture, refreshSeconds: 60, makeServer: () => http.fake,
    })
    assert.equal(counts.upserts, 1, 'one refresh at start')
    assert.equal(http.calls.listen, 1)

    mock.timers.tick(60_000)
    await new Promise((resolve) => setImmediate(resolve)) // let the refresh the tick started finish
    assert.equal(counts.upserts, 2, 'the timer fires while the server is up')

    await running.close()
    await running.close() // twice is safe
    assert.equal(http.calls.close, 1, 'the listener is closed once')
    assert.equal(counts.closes, 1, 'the store is closed once')

    mock.timers.tick(10 * 60_000)
    await new Promise((resolve) => setImmediate(resolve))
    assert.equal(counts.upserts, 2, 'the timer does not fire after close')
  } finally {
    mock.timers.reset()
  }
})
