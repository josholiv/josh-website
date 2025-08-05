---
title: 'Building a Chess.com stats widget with Preact'
pubDate: 2025-05-11
description: 'I made a widget that fetches and displays your live chess stats using the Chess.com Public API.'
author: 'Josh Olivier'
image:
    url: '/images/blog/post-5/preview.png'
    alt: 'Chess.com stats widget preview'
tags: ["chess", "coding"]
---
## A simple widget for Chess.com stats

When building the [About](https://josholivier.com/about) page of this site, I had the idea to include some of my "stats" from other sites and platforms that I use around the web. As someone who enjoys the occasional online chess match, I naturally landed on the idea of showing off some of my online chess stats (as mediocre as they are). 

After some digging, I discovered that, thanks to the [Chess.com Public API](https://www.chess.com/news/view/published-data-api), displaying live stats for any Chess.com user on a webpage is delightfully easy. I decided to make it into a full-on widget that anyone can use. 

You can [check out my code on GitHub](https://github.com/josholiv/chess-stats-widget), and in this post I'll walk you through how to plug the widget in to your own site or portfolio.

## Overview
The chess stats widget is a responsive, card-style component built with [Preact](https://preactjs.com/), a lightweight React alternative. It pulls your Chess.com stats in real-time and displays:

- Ratings for Bullet, Blitz, Rapid, and Daily games
- Your Puzzle rating
- Total games played across all modes
- A minimalist, chessboard-themed background
- Color-coded stat cards for easy visual parsing

Here’s a quick preview (showing Magnus Carlsen's stats, not mine 😅):

<img src="/images/blog/post-5/preview.png" alt="Chess.com stats widget preview" class="blog-body-pic" />

## How it works

### Fetching the stats

This function uses ```fetch``` API to get a user's stats from Chess.com. The response includes ratings and game records for various game types like Blitz, Bullet, Rapid, and more.

```tsx wrap title="ChessStats.tsx"
const fetchChessStats = async (username: string) => {
  const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
  return await response.json();
};
```

### Basic setup with Preact

Here we’re using ```useState``` to store the fetched stats and ```useEffect``` to load them when the component mounts. It’s a pretty standard Preact pattern for loading data on the client side.

```tsx wrap title="ChessStats.tsx"
const ChessStats: FunctionalComponent = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const getStats = async () => {
      const userStats = await fetchChessStats(username);
      setStats(userStats);
    };
    getStats();
  }, []);
```

### Calculating total games played

The Chess.com API doesn’t directly give you a “total games played” count, so we compute it by summing all wins, losses, and draws across game modes that report a record:

```tsx wrap title="ChessStats.tsx"
const totalGames = Object.values(stats)
  .filter((mode: any) => mode && mode.record)   
  .reduce((acc: number, mode: any) => {
    return acc + (mode.record.win || 0) + (mode.record.loss || 0) + (mode.record.draw || 0);
  }, 0);
```

### The ```formatCard()``` helper

Each stat is rendered using this function. It outputs a styled card with:

- A stat label (e.g., Blitz)
- The numeric value (e.g., rating)
- An optional link to learn more about each rating type
- A customizable background color and emoji

You can change the card styling and colors easily here.

```tsx wrap title="ChessStats.tsx"
const formatCard = (
  label: string,
  value: string | number | undefined,
  href?: string,
  color?: string,
  emoji?: string
) => (
  <div style={{ ... }}>
    <div style={{ backgroundColor: color || '#252525', ... }}>
      <strong>{value ?? '–'}</strong>
      <div>{href ? <a href={href}> {label} </a> : label}</div>
      <div>{emoji}</div>
    </div>
  </div>
);
```

### Putting it all together

This final section builds the UI. It wraps the stats cards in a flex container with a themed background (a chessboard SVG). Each stat is rendered as a card, and the layout adjusts responsively for different screen sizes:

```tsx wrap title="ChessStats.tsx"
return (
  <div style={{ display: 'flex', justifyContent: 'center', ... }}>
    <div style={{
      backgroundImage: `url(${chessboard})`,
      backgroundSize: 'cover',
      ...
    }}>
      <p>My current <strong>Chess.com</strong> stats are:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', ... }}>
        {formatCard('Games', totalGames, undefined, '#c2185b', '♟️')}
        {formatCard('Bullet', stats.chess_bullet?.last?.rating, ..., '#f200ff', '♟️💨')}
        ...
      </div>
    </div>
  </div>
);
```

## How to install and run the widget

### 1. Clone the Github repo

```bash wrap title="bash"
git clone https://github.com/josholiv/chess-stats-widget.git
cd chess-stats-widget
```

### 2. Install dependencies and start the dev server

```bash wrap title="bash"
npm install
npm run dev
```

### 3. Set your Chess.com username
Open src/components/ChessStats.tsx and update Magnus Carlsen's username to your own (or any other Chess.com user's username):

```tsx wrap title="ChessStats.tsx"
const username = 'YourUsernameHere';
```

That's it! You should now see the widget update with your current Chess.com stats (or the stats of whoever's username you put). If you want to customize the widget further, you can follow the next steps. 

## Customization

You can personalize the look and feel of the widget by tweaking the ```formatCard()``` function. Here’s what you can customize:

- Stat Labels — Change emojis or rename cards
- Card Colors — Adjust the background colors for each stat
- External Links — Add info links to explain game types
- Background Image — Swap out chessboard.svg with your own SVG or image file

To change the background, modify this line:

```tsx title="ChessStats.tsx"
const chessboard = '/chessboard.svg';
```

## Use it anywhere! 

Feel free to fork this project on Github and integrate it into your own web project, and let me know if you build something cool with it!