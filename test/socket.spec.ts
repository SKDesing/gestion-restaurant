import { describe, it, expect, afterAll } from 'vitest'
import { createSocketServer } from '../src/server/socket'
import { createServer } from 'http'
import { io as clientIO, Socket } from 'socket.io-client'

describe('socket server', () => {
  let server: any
  let url: string

  afterAll(() => {
    if (server?.server) server.server.close()
  })

  it('responds to ping with pong on /admin', () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const port = 5001

        // create http server and attach socket io using createSocketServer
        const httpServer = createServer((req, res) => res.end('ok'))
        const io = createSocketServer(httpServer as any)

        httpServer.listen(port, () => {
          // eslint-disable-next-line no-console
          console.log(`test http server listening on ${port}`)
        })

        server = { server: httpServer, io }
        url = `http://localhost:${port}`

        const socket: Socket = clientIO(`${url}/admin`, { transports: ['websocket'] }) as any

        socket.on('connect', () => {
          socket.emit('ping', { foo: 'bar' })
        })

        socket.on('pong', (payload: any) => {
          try {
            expect(payload).toHaveProperty('foo', 'bar')
            socket.disconnect()
            resolve()
          } catch (err) {
            reject(err)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  })
})
