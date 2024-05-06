![plot](./assets/github-banner-1.png)

📢 Use🏃 this project, [contribute](https://github.com/vtex-apps/speedy) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

## Description

The **VTEX Speedy** app optimizes your store's performance by:

* Managing third-party scripts: delaying their execution or running them in web workers via Partytown integration.
* Pre-connecting and fetching the DNS reducing the time to connect to 3rd-party domains
* Prefetching pages, enhancing navigation for product listing pages (PLPs) and category views.

Moreover, **Speedy** leverages LCP (Largest Contentful Paint) and FCP (First Contentful Paint) metrics to ensure that third-party scripts do not impact page loading times.

### 3rd-party handling


![plot](./assets/speedy-explanation1.png)

## Web Vitals

### Total Blocking Time

Delaying and running scripts on web workers reduces execution on the main thread, enhancing performance:

1) Each project should be carefully analyzed and configured based on specific needs.
2) Although third-party scripts can affect loading times, their impact must be precisely calibrated.

**Speedy offers the flexibility to customize the delay timing for each third-party script by domain.**

### Interaction to Next Paint

**Speedy** enhances the INP by proactively caching pages according to predefined rules

![plot](./assets/speedy-prefetching2.png)

Initially, **Speedy** is set up to prefetch and preload Product Detail Page (PDP) URLs on Product Listing Page (PLP) views. However, this functionality can be extended to any hyperlink by assigning the "**speedy**" class to `<a></a>` tags or by adjusting the settings on the configuration page.

**Prefetch:** **Speedy** optimizes loading times by prefetching the SPA URL, thus caching the target URL in advance;
**Preload:** Taking a cue from Next.js, **Speedy** enhances navigation efficiency by preloading "next URLs," thereby signaling the browser to prioritize the target URL.

Example

```html
<a class="my-custom-app-0-x-component--speedy">...</a>
```

*It will recognize whatever string includes "speedy"*

### TTFB, LCP & FCP improvement

**Speedy** does not impact directly on these metrics, however, there are steps to improve it the we strongly recommend:

Overwrite cache control settings on these apps:

**vtex.render-server**:  >= 8.171.0

![plot](./assets/vtex-render-server.jpg)

**vtex-rewriter**: >= 1.62.0

![plot](./assets/vtex-rewriter.jpg)

Max-Age: 300 (5 minutes)

Stale Revalidate overwrite: 8600 (24 hours)

By making these changes, it will improve the cache CDN, keeping a version of the content for 24 hours while the CDN gets a new content on the source(VTEX).

**Make sure the 8600 attend the store, otherwise, lower values can be applicable**

## Integrations

### Partytown

[Partytown](https://github.com/BuilderIO/partytown) library is built into **Speedy** and that has been optimized to function flawlessly and to fully utilize its capability to execute scripts in service workers without any issues.

### Pixel Server & Pixel Server UI

These enhancements boost **Speedy's** flexibility by allowing modifications such as configuring pixel apps to "text/partytown" for processing in web workers. This setup enables the orderly organization and rearrangement of pixel apps as needed. 


## Installing Speedy

1. Access the **Apps** section in your account's admin page and look for the **Speedy** box;
2. Then, click on the **Install** button;
3. You'll see a warning message about needing to enter the necessary configurations. Scroll down and fill the additional information in the settings area
4. Click on **Save**.

## Setting up

You must need to set up speed to ensure that everything is running smoothly
After installing **Speedy**, follow this steps:

#### Partytown scripts (TBT)

1. Identify the 3rd-party scripts that are running into your site, we strongly recommend to use [Webpage Test](https://www.webpagetest.org/);
2. Once you get it, open the Pixel Render UI by accessing this URL: **/admin/pixel-server-ui/**
3. Select carefully the Pixel Apps you want to run through *Speedy/Partytown*

![plot](./assets/pixel-server.jpg)

4. Click on Save Button and test if everything is ok

## Speedy Setup

Currently **Speedy** doesn't have a friendly UI to setup the config, the only way is to access the Settings on App Management:

![plot](./assets/speedy-config2.jpg)

### Time in seconds to push the 3rd-party
By the default, **Speedy** **delays 5s** when it identifies a 3rd script that could affect loading, here you can modify this option;

### List of 3rd-party to push

In this field you can provide a custom list of the domains that you want to push, or adding **0** the **Speedy** will only wait the LCP and FCP to run them.

***Pattern: domain,time-in-seconds;***
```
googletagmanager,0;onetrust.com,0;3rdparty.com,10;
```

We strongly recommend to let Google Tag Manager and Onetrust(or similar) with 0 

### [PRECONNECT] List of domains to preconnect
List of 3rd-party domains to preconnect, by adding the domains here, **Speedy** will add the `<link ref="preconnect">` and `<link ref="dns-prefetch">` in order to speed up the loading time of all requested connections.

***Pattern: domain;domain;...***
```
googletagmanager;onetrust.com;3rdparty2.com;
```

### [BLACKLIST] List of domains to block
Speedy provides a feature to block the domains for testing purpose.

***Pattern: domain;domain;...***
```
googletagmanager;onetrust.com;3rdparty2.com;
```

### Prefetch Anchors

This flag enables or disables the **Prefetching Feature**.

### Queue Delay

This configuration impacts on the **Prefetching Feature**. The queue delay is the time in seconds for each element will take to process (prefetch and preload).

### Prefetch Rule

That's the rule that will check if the anchors should be cached, by default it's product-summary for the PLPs.

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
