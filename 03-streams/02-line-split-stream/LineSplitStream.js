const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const lastLine = this.lastLine !== null && this.lastLine !== undefined ? this.lastLine : '';
    const lines = (lastLine + chunk.toString()).split(os.EOL);

    this.lastLine = lines.pop();

    lines.forEach(line => {
      this.push(line)
    });

    callback();
  }

  _flush(callback) {
    const lastLine = this.lastLine !== null && this.lastLine !== undefined ? this.lastLine : '';
    this.push(lastLine);
    callback()
  }
}

module.exports = LineSplitStream;
