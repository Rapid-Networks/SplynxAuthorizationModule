# Styleguide

> law for thee but not for me

While this is by no means concrete, I would like to keep this here for reference.
Please feel free to mock me in the discussion tab should I not follow my own suggestions.

## Global variables:

- `const`/`let` keyword and in `UPPER_SNAKE_CASE`

  _example:_

```TypeScript
 let MUTABLE_GLOBAL = "mutable value";
 const GLOBAL_CONSTANT = "immutable value";
 const CONFIG = {
    key: "value",
 };
```

## Class names:

- `UpperCamelCase`
- for **Static Class properties** we revert to `UPPER_SNAKE_CASE`

_example:_

```TypeScript
class SomeClassExample {
  static STATIC_PROPERTY = "value";
}`

```

## Functions and scoped variable names:

- `lowerCamelCase`

  _example:_

```TypeScript
function doSomething() {
  const someConstExample = "immutable value";
}
```

There is a prettier config found [here](#) // to be implemented
