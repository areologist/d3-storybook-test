import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import AreaChart from '../components/AreaChart';
import { generateLineData } from '../data';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

const testData = generateLineData(20);

storiesOf('AreaChart', module)
  .add('without data', () => <AreaChart data={[]} width={960} height={400} />)
  .add('with random test data', () => <AreaChart data={testData} width={960} height={400} />);
