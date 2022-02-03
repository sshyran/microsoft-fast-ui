# Explorations

These individual sites are explorations into ideas for SSR, progressive enhancement, or general performance improvements.

## Client side style render

This exploration implements a fast-style web component that, assuming the rest of the relevant client side HTML has been rendered and the design system tokens have placed CSS variables into the body element, will apply a CSSStyleSheet to the web components shadow DOM.

## Client side template and style render

Building on the previous example, this example takes the work a step farther and implements a template renderer and streams JSON from NodeJS, which is then interpreted and rendered via the client.

## Stream HTML chunks

This work also builds on the client side style render exploration, with a HTML streaming setup via NodeJS.