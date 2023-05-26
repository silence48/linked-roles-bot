import { Slider, Image } from '~/src/atoms/components';
import { withDesign } from 'storybook-addon-designs';
import { Meta } from '@storybook/react';
import '~/styles/index.css';
// import { FakeLink, experienceCards } from '~/src/atoms/helpers';
// import { ExperienceCard } from '~/src/atoms/components/ExperienceCard';

export default {
  component: Slider,
  title: 'Development / Slider',
  decorators: [withDesign]
};

// export const Cards = () => {
//   const cards = experienceCards.map((card) => {
//     return <ExperienceCard experience={card.experience} host={card.host} component={FakeLink} />
//   })
//   return <Slider cards={cards}/>
// };

// Cards.parameters = {
//   design: {
//     type: 'figma',
//     url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
//   }
// };

export const ImageCarousel = () => {
  const cards = [
    <Image imageUrl='https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80'/>,
    <Image imageUrl='https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80'/>,
    <Image imageUrl='https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80'/>,
    <Image imageUrl='https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80'/>,
    <Image imageUrl='https://images.unsplash.com/photo-1575424909138-46b05e5919ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80'/>,
    <Image imageUrl='https://images.unsplash.com/photo-1559333086-b0a56225a93c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80'/>,
  ]
  return <Slider cards={cards}/>
};

ImageCarousel.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/vkIFRuwbONhF3qrGI7bHvL/App?node-id=2%3A129'
  }
};