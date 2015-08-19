## jet

Command-line download tool for the Node.js platform.

#### installation

```
npm i -g jet-dwnldr
```

#### usage

jet-dwnldr URL

#### how it works

Basically, it works like wget --continue.

It downloads a file in the current directory.

If there's already a file with the same name, jet will assume that it is the first portion of the remote file and will ask the server to continue the retrieval from an offset equal to the length of the file.

This will only work with HTTP and HTTPS servers that support the 'Range' header.

If the URL ends with a '/', the file will be named 'index.html'.

If the status code of the response is 400 or greater, it will stop and print the status message.

If you don't have write permissions in the current directory, it will stop and print an error message.

#### References

- Partially downloads: [Wget Manpage](https://www.gnu.org/software/wget/manual/wget.html#Download-Options)
- Node file system API: [fs](https://iojs.org/api/fs.html)
- HTTP and HTTPS request library: [hyperquest](https://www.npmjs.com/package/hyperquest)
- HTTP response handling: [http](https://iojs.org/api/http.html#http_http_incomingmessage)
