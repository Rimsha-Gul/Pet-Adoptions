import io from 'socket.io-client'

const socket = io(
  'https://purrfect-adoptions-server-rimsha-gul-dev.apps.sandbox-m4.g2pi.p1.openshiftapps.com/'
)
export default socket
