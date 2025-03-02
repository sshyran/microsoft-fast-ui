---
id: introduction
title: Introduction
sidebar_label: Introduction
custom_edit_url: https://github.com/microsoft/fast/edit/master/sites/website/src/docs/introduction.md
---

Welcome to the FAST documentation! We're glad you're here and can't wait to show you around.

## What is FAST?

FAST is a collection of technologies built on Web Components and modern Web Standards, designed to help you efficiently tackle some of the most common challenges in website and application design and development.

### What are Web Components?

"Web Components" is an umbrella term that refers to a collection of web standards focused on enabling the creation of custom HTML elements. Some of the standards that are under the umbrella include the ability to define new HTML tags, plug into a standard component lifecycle, encapsulate HTML rendering and CSS, parameterize CSS, skin components, and more. Each of these platform features is defined by the W3C and has shipped in every major browser today.

### How does FAST leverage Web Components?

One of FAST's driving principals is "strive to adopt open, web standards-based approaches as much as possible." To that end, FAST is built directly on the W3C Web Component standards mentioned above, and does not create its own component model. This allows components built with FAST to function the same as built-in, native HTML elements. You do not need a framework to use FAST components, but you can use them in combination with any framework or library of your choice.

### How can FAST help me?

To understand how FAST can help you, let's take a look at the **FAST tech stack from top to bottom**. 

At the top of the stack, FAST provides a set of Web Components: **`@microsoft/fast-components`**. This library include a common set of components found in many websites and apps. 

<div markdown="1" style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>

```mermaid
flowchart
  subgraph FAST [ ]
    direction TB
    FastComponents("@microsoft/fast-components\n(Component library that implements FAST Frame Design System)")
  end

  style FAST fill:transparent,stroke:none
  style FastComponents fill:#f4f4f4,stroke:#fb356d,stroke-width:3px,color:#333
```

</div>

Example components include button, card, modal, menu, tab, tree-view, and more. `@microsoft/fast-components` provides an industry-focused design system, which we call "FAST Frame". If you're looking to integrate FAST components into an existing site or app, or if you need more control over the theme of the components, this is the option you'll want to start with.

**What if you're not just looking for a set of components to use, but you also need to implement a custom *design system*?** 

This is where the second level of the stack comes into play. **`@microsoft/fast-foundation`** provides foundational building blocks that can be assembled to create new design systems and component libraries. 

<div markdown="1" style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>

```mermaid
flowchart
  subgraph FAST [ ]
    direction TB
    FastComponents("@microsoft/fast-components\n(Component library that implements FAST Frame Design System)")
    FastFoundation("@microsoft/fast-foundation\n(Building blocks for custom design systems/component libraries)")
    FastComponents -.-> FastFoundation
  end

  style FAST fill:transparent,stroke:none
  style FastComponents fill:#f4f4f4,stroke:#f4f4f4,color:#333
  style FastFoundation fill:#f4f4f4,stroke:#fb356d,stroke-width:3px,color:#333
```
</div>

For example, if you wanted to implement Google's Material Design, you could do that using `@microsoft/fast-foundation`; you could also implement something like Twitter Bootstrap. `@microsoft/fast-components` assemble the building blocks of `@microsoft/fast-foundation` to create its component sets. 

**What types of building blocks are we talking about though?** 

Perhaps the most valuable feature of the foundation is that it provides base component behaviors and templates for the standard components. So, if you want to implement a tree-view in your design system, for example, you would use the foundation base component behavior and template, but combine it with your own styles. 

The foundation components implement the state management, accessibility, keyboard navigation, and extensibility/composition model so you don't have to write that code. Additionally, foundation provides facilities for dynamic style behaviors, CSS property management, algorithmic color, RTL, high contrast, and more. You don't have to write any of that. Just assemble the building blocks and add your styles to create your own component library, expressing your own design system. So far we've talked about using existing components and creating new design systems and component libraries from existing pieces. But FAST enables you to create completely new web components as well. 

Enter **`@microsoft/fast-element`**, the lowest level part of the FAST tech stack. This is a lightweight library for building performant, memory-efficient, standards-compliant Web Components.

<div markdown="1" style={{ display:"flex", justifyContent:"center", marginBottom:"20px" }}>

```mermaid
flowchart
  subgraph FAST [ ]
    direction TB
    FastComponents("@microsoft/fast-components\n(Component library that implements FAST Frame Design System)")
    FastFoundation("@microsoft/fast-foundation\n(Building blocks for custom design systems/component libraries)")
    FastElement("@microsoft/fast-element\n(Lightweight library for building custom web components)")
    FastComponents -.-> FastFoundation -.-> FastElement 
  end

  style FAST fill:transparent,stroke:none
  style FastComponents fill:#f4f4f4,stroke:#f4f4f4,color:#333
  style FastFoundation fill:#f4f4f4,stroke:#f4f4f4,color:#333
  style FastElement fill:#f4f4f4,stroke:#fb356d,stroke-width:3px,color:#333
```
</div>

`@microsoft/fast-element` provides a thin layer of opinion on top of Web Components, lifting the level of abstraction just enough to make it easier and faster to build components. `@microsoft/fast-element` helps by providing attribute/property syncing, rich Model-View-ViewModel (MVVM), efficient template rendering/update, style composition, and much more. The entire `@microsoft/fast-element` library, *without* tree-shaking, is around 10kb minified and GZipped. It was designed for tree-shaking from the beginning, so any feature you don't use when building a component will be removed during build, allowing for highly efficient optimized payloads as small as 4.5k.

## Where should I start?

We hope you're excited by the possibilities that FAST presents. But, you may be wondering where to start. Here are a few statements that describe various members of our community. We recommend that you pick the statement you most identify with and follow the links where they lead. You can always come back and explore another topic at any time.

* "I just want ready-made components!"
  * [Jump to the component docs.](/docs/components/getting-started)
* "I want to build my own design system."
  * [Jump to the design system docs.](/docs/design-systems/overview)
* "I want to build my own components."
  * [Jump to the fast-element docs.](/docs/fast-element/getting-started)
* "I need to integrate FAST with another framework or build system."
  * [Jump to the integration docs.](/docs/integrations/introduction)
* "I want to look at a quick reference."
  * [Jump to the Cheat Sheet](/docs/resources/cheat-sheet)

## Joining the community

Looking to get answers to questions or engage with us in realtime? Our community is most active [on Discord](https://discord.gg/FcSNfg4). Submit requests and issues on [GitHub](https://github.com/Microsoft/fast/issues/new/choose), or join us by contributing on [some good first issues via GitHub](https://github.com/Microsoft/fast/labels/community:good-first-issue).

We look forward to building an amazing open source community with you!
