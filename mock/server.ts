import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const spec = parse(readFileSync(new URL('../docs/api/openapi.yaml', import.meta.url), 'utf8'))

// One route per (method, path): its 200 example, read straight from the contract.
// This mock serves ONLY those success examples: it never validates input and never answers 400.
const routes = Object.entries<any>(spec.paths).flatMap(([path, item]) =>
  ['get', 'put'].filter((m) => item[m]).map((m) => ({
    method: m.toUpperCase(),
    pattern: new RegExp('^' + path.replace(/\{[^}]+\}/g, '[^/]+') + '$'),
    example: item[m].responses['200'].content['application/json'].example,
    name: `${m.toUpperCase()} ${path}`,
  })))
const missing = routes.filter((r) => r.example === undefined).map((r) => r.name)
if (missing.length) throw new Error(`openapi.yaml has no 200 example for: ${missing.join(', ')}`)

export function answer(method: string, url: string): { status: number; body: unknown } {
  const { pathname } = new URL(url, 'http://localhost')
  const route = routes.find((r) => r.method === method && r.pattern.test(pathname))
  return route ? { status: 200, body: route.example } : { status: 404, body: { error: 'not_in_contract', message: 'no such path' } }
}

export function handle(req: IncomingMessage, res: ServerResponse): void {
  const { status, body } = answer(req.method ?? 'GET', req.url ?? '/')
  res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify(body))
}

if (process.argv[1] === import.meta.filename) createServer(handle).listen(Number(process.env.PORT ?? 8080))
