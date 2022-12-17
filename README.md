# robocorp-multiples

## Description

This service parses a file containing 3 numbers `x`, `y` and `max` and returns the number of multiples for both numbers
`x` or `y` that are below `max`.

It uses NodeJS streams to read and calculate the data, and a bonary tree to sort the results by the number of multiples.

## Instalation

```bash
npm install
```

## Usage

```bash
npm run start -- <input-file> <output-file>
```
