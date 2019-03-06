import { version } from '../../src/iframe/package.json'

const boot = ({ title, id }) => `
<!DOCTYPE html>
<title>${title}</title>
<style>
  body {
    background: #08141e;
  }
  iframe {
    border: none;
    width: calc(100vmin - 3rem);
    height: calc(100vmin - 3rem);
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  @media screen and (max-width: 464px) {
    iframe {
      width: calc(100vmin);
      height: calc(100vmin + 6.5rem);
    }
  }
</style>
<body>
  <iframe src='https://script8.github.io/iframe-v${version}.html?id=${id}' />
</body>
`
export default boot