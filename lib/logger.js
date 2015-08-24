
import bunyan from 'bunyan';
import pkg    from '../package.json';

export default bunyan.createLogger({
  name: pkg.name,
  streams: [
    { stream: process.stdout }
  ],
  serializers: bunyan.stdSerializers
});