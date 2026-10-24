# Run it

You need Node 22.13 or newer. From the repository root:

```sh
npm ci
QUAKEWATCH_FEED_FILE=test/fixtures/usgs/recorded-2026-10-22.geojson npm start
```

The server reads three real earthquakes from the recorded file (no network needed) and listens on
http://localhost:8080. Leave `QUAKEWATCH_FEED_FILE` out and it reads the live USGS feed instead, and again every 5 minutes.

In a second terminal:

**1. Events in a region**

```sh
curl 'http://localhost:8080/api/v1/events?region=western-north-america'
```

```json
{"events":[{"id":"nc75453191","time":"2026-10-22T01:43:51.960Z","magnitude":1.69,"depthKm":13.5299997329712,"lat":40.236499786377,"lon":-124.162666320801,"place":"14 km SE of Petrolia, CA"}]}
```

**2. Set a threshold**

```sh
curl -X PUT -H 'content-type: application/json' -d '{"minMagnitude": 1.5, "maxDepthKm": 20}' \
  http://localhost:8080/api/v1/thresholds/western-north-america
```

```json
{"region":"western-north-america","minMagnitude":1.5,"maxDepthKm":20}
```

**3. Alerts**

```sh
curl 'http://localhost:8080/api/v1/alerts?region=western-north-america'
```

```json
{"alerts":[{"region":"western-north-america","quake":{"id":"nc75453191","time":"2026-10-22T01:43:51.960Z","magnitude":1.69,"depthKm":13.5299997329712,"lat":40.236499786377,"lon":-124.162666320801,"place":"14 km SE of Petrolia, CA"}}]}
```

Before step 2 the alert list is empty: a region nobody has set a threshold for uses the default, magnitude 5 and
depth 70 km, and a 1.69 does not cross it.

## Settings

All optional.

| variable | default | meaning |
|---|---|---|
| `PORT` | `8080` | the port to listen on |
| `QUAKEWATCH_DB` | `./quakewatch.db` | the SQLite file |
| `QUAKEWATCH_FEED_FILE` | none | read this GeoJSON file instead of the USGS feed |
| `QUAKEWATCH_REFRESH_SECONDS` | `300` | how often the feed is read again |

`npm run mock` still starts the mock, which only answers the contract's examples.
