import React from 'react'
import {test, expect} from 'vitest';
import createModal from '../src/index'

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

test('Create modal', async () => {
  const modal = createModal<{title: string}>(({title}, ref) => {
    return <div>{title}</div>
  })

  expect(modal.instance).toBeNull();
  expect(modal.render).toBeDefined();
  expect(modal.destroy).toBeDefined();
  expect(modal.root).toBeInstanceOf(HTMLElement);
})

test('Destroy modal', async () => {
  const modal = createModal<{title: string}>(({title}, ref) => {
    return <div>{title}</div>
  })

  modal.render({
    title: 'react-simple-layer'
  })

  expect(modal.Root!['_internalRoot']).not.toBeNull();

  modal.destroy();
  await wait(100);

  expect(modal.Root!['_internalRoot']).toBeNull();
})
