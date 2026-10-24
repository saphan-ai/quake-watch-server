import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { answer, handle } from '../mock/server.ts'

const specUrl = new URL('../docs/api/openapi.yaml', import.meta.url)
const spec = parse(readFileSync(specUrl, 'utf8'))

test('the contract lints with no errors', () => {
  const redocly = new URL('../node_modules/.bin/redocly', import.meta.url).pathname
  execFileSync(redocly, ['lint', specUrl.pathname], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60_000 })
})

test('the region list is closed and has at most five regions', () => {
  const regions: string[] = spec.components.schemas.Region.enum
  assert.ok(regions.includes('southeast-asia'))
  assert.ok(regions.length <= 5)
})

// Every operation in the contract, with a concrete URL for its path.
const operations = Object.entries<any>(spec.paths).flatMap(([path, item]) =>
  ['get', 'put'].filter((m) => item[m]).map((m) => ({
    method: m.toUpperCase(),
    url: path.replace('{region}', 'southeast-asia') + (path === '/api/v1/alerts' ? '?region=southeast-asia' : ''),
    example: item[m].responses['200'].content['application/json'].example,
  })))

test('the contract has the five operations the order names', () => {
  assert.deepEqual(
    operations.map((o) => `${o.method} ${o.url.split('?')[0]}`).sort(),
    ['GET /api/v1/alerts', 'GET /api/v1/events', 'GET /api/v1/thresholds/southeast-asia',
      'GET /healthz', 'PUT /api/v1/thresholds/southeast-asia'],
  )
})

for (const op of operations) {
  test(`mock answers ${op.method} ${op.url} with the example`, () => {
    assert.deepEqual(answer(op.method, op.url), { status: 200, body: op.example })
  })
}

test('every operation has a 200 example, and the PUT has a request example', () => {
  for (const op of operations) assert.notEqual(op.example, undefined, `${op.method} ${op.url} has no 200 example`)
  assert.notEqual(spec.paths['/api/v1/thresholds/{region}'].put.requestBody.content['application/json'].example, undefined)
})

test('the HTTP handler sends the example as serialized JSON', () => {
  for (const op of operations) {
    const sent: { status?: number; headers?: any; body?: string } = {}
    const res: any = {
      writeHead(status: number, headers: any) { sent.status = status; sent.headers = headers; return res },
      end(body: string) { sent.body = body },
    }
    handle({ method: op.method, url: op.url } as any, res)
    assert.equal(sent.status, 200)
    assert.equal(sent.headers['content-type'], 'application/json')
    assert.equal(sent.body, JSON.stringify(op.example))
  }
})

test('mock answers a path outside the contract with 404', () => {
  assert.equal(answer('GET', '/api/v1/nothing').status, 404)
})
