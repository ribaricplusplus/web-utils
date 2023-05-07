# Ribarich web utils

## FlexObserver

Flex observer allows you to detect when some flex elements wrap.

```js
import { FlexObserver } from '@ribarich/web-utils'
const observer = new FlexObserver()
const config = {
	flexContainer: document.querySelector('.flex-container')
	changeCallback: ( wrappedElements ) => { // Do something with elements that wrapped }
}
observer.observe(config)
```
