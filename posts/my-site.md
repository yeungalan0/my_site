---
title: "My Awesome Personal Site"
date: "2021-06-05"
tags: ["projects"]
---

# Purpose

Details the work done for my personal website (hopefully what you're reading
this on right now!), including resources, tech used, and lessons learned.

# Links

- [Project repo](https://github.com/yeungalan0/my_site)
- [Site](/)

# Concept

Honestly, I was feeling pretty bored, and had no idea what kind of cool side
project I'd like to start, so I decided that a great procrastination project
would be to update [my old personal website][old-site]! Aside from it being a
fun procrastinating project where I could sharpen my web development skills, a
personal website also serves as a great medium for documenting and publicizing
my personal projects and random thoughts. And since it's git based, I thought
there might be some good potential to also have others help to edit and update
written articles. Though really it's just my own little personal space on the
internet where I can be creative (and rant)!

# Tech used

- Typescript: I have to say, I like the strict type checking and structure of
  typescript far more than the wild world of pure Javascript.
- ReactJS: Great front end framework. It was super easy to use and learn, though
  hooks do get confusing at times.
- [Material UI][material-ui]: This is a React component library based off of
  Material, that can be utilized to make your site look great (or at least not
  terrible in my case). It does take a little while to understand how to do
  things properly and find the correct resources in the Material UI world, but I
  think effort is worth it.
- NextJS: Excellent front end React framework that I'm using to provide the
  frontend for this and other projects.
- [Vercel][vercel]: Awesome hosting platform (and developers of NextJS) that I
  use to build and deploy my site.
- [Cypress][cypress]: This was my first time really diving into Cypress, but I
  have to say it's a really great front-end testing framework, with some solid
  documentation, simple design, and consistent results (when done properly). I'm
  learning more and more that the front end is a difficult place to test,
  especially the UI, but Cypress makes it fairly easy to test different
  scenarios, and I'll definitely be using it a lot more in the future if not
  have it be my main front end test suite.
- Jest
- [GitHub Actions][github-actions]: This was also my first time really diving
  into GitHub Actions (which is the GitHub CI/CD pipeline very similar to
  GitLab's). I use it to automatically run my Cypress/Jest tests in a pipeline,
  and ensure the branch looks healthy before merging and/or deploying.
- [Prettier][prettier]: This is an automatic formatter that I've been using on
  my Typescript/Javascript projects (it also works on Markdown). I don't know
  how I operated before without it. It makes life significantly easier for me as
  a developer (or crazy person) to no longer need to painstakingly deliberate
  about using single or double quotes when formatting and just let this tool
  handle it. I'll be using it on all my projects in the future.

# Lessons learned

## There's a good enough

There are a lot of things that still bug me about this site. It still looks
super basic in terms of Material design, so I need to add my personal touches
including updating the theme, the blog cards could use photos, I still need to
add Markdown code support, among other things...many other things. Point is I
could spend the next 5 years improving this site, and still I'd have things I'd
want to make better. I like this site, and I had fun making it, but I've
minimally accomplished what I set out to do. I made an awesome site I could blog
on and improve upon when I'm bored. That's good enough...for now.

## Testing is complicated

Backend testing with units makes a lot of sense, but on the front-end,
especially with GUI components that method of testing becomes pretty cumbersome.
I think using something like Cypress, where you can test the intention of your
code through a browser is the more optimal approach, and it saves me a lot of
effort (and headache) in understanding how a test library paints the UI
components to test. The only downside is that it takes a while to run each test
since it's browser based. I wish I researched and found Cypress sooner, and
probably would have written all my tests (even unit tests when necessary) in
Cypress.

# Resources

- [Typescript on NextJS](https://dev.to/filippofonseca/how-to-set-up-a-next-js-project-with-typescript-and-react-576h)
- [Dark theme switch guide](https://dev.to/felixmohr/setting-up-a-blog-with-next-js-react-material-ui-and-typescript-2m6k)

[old-site]: http://yeungalan0.github.io/
[material-ui]: https://material-ui.com/company/about/
[vercel]: https://vercel.com/about
[cypress]: https://www.cypress.io/about/
[github-actions]:
  https://docs.github.com/en/actions/creating-actions/about-actions
[prettier]: https://prettier.io/docs/en/
