# Documentação: https://resend.com/docs/api-reference/introduction/

*Gerado automaticamente por Documentation Crawler v2.0.2*
*Data: 2026-01-19 13:32:22*

## Metadados da Execução

- **Total de páginas**: 106
- **Páginas falhas**: 2
- **Cache hits**: 0
- **Links encontrados**: 262
- **Code blocks extraídos**: 0

## Table of Contents

- [Email fordevelopers](#email-fordevelopers)
- [Log in to Resend](#log-in-to-resend)
- [Get in touch](#get-in-touch)
- [Create API key](#create-api-key)
- [Delete API key](#delete-api-key)
- [List API keys](#list-api-keys)
- [Create Audience](#create-audience)
- [Delete Audience](#delete-audience)
- [Retrieve Audience](#retrieve-audience)
- [List Audiences](#list-audiences)
- [Create Broadcast](#create-broadcast)
- [Delete Broadcast](#delete-broadcast)
- [Retrieve Broadcast](#retrieve-broadcast)
- [List Broadcasts](#list-broadcasts)
- [Send Broadcast](#send-broadcast)
- [Update Broadcast](#update-broadcast)
- [Create Contact Property](#create-contact-property)
- [Delete Contact Property](#delete-contact-property)
- [Retrieve Contact Property](#retrieve-contact-property)
- [List Contact Properties](#list-contact-properties)
- [Update Contact Property](#update-contact-property)
- [Add Contact to Segment](#add-contact-to-segment)
- [Create Contact](#create-contact)
- [Delete Contact Segment](#delete-contact-segment)
- [Delete Contact](#delete-contact)
- [Retrieve Contact Topics](#retrieve-contact-topics)
- [Retrieve Contact](#retrieve-contact)
- [List Contact Segments](#list-contact-segments)
- [List Contacts](#list-contacts)
- [Update Contact Topics](#update-contact-topics)
- [Update Contact](#update-contact)
- [Create Domain](#create-domain)
- [Delete Domain](#delete-domain)
- [Retrieve Domain](#retrieve-domain)
- [List Domains](#list-domains)
- [Update Domain](#update-domain)
- [Verify Domain](#verify-domain)
- [Cancel Email](#cancel-email)
- [List Attachments](#list-attachments)
- [List Sent Emails](#list-sent-emails)
- [List Attachments](#list-attachments)
- [List Received Emails](#list-received-emails)
- [Retrieve Attachment](#retrieve-attachment)
- [Retrieve Email](#retrieve-email)
- [Retrieve Attachment](#retrieve-attachment)
- [Retrieve Received Email](#retrieve-received-email)
- [Send Batch Emails](#send-batch-emails)
- [Send Email](#send-email)
- [Update Email](#update-email)
- [Errors](#errors)
- [Introduction](#introduction)
- [Pagination](#pagination)
- [Usage Limits](#usage-limits)
- [Create Segment](#create-segment)
- [Delete Segment](#delete-segment)
- [Retrieve Segment](#retrieve-segment)
- [List Segments](#list-segments)
- [Create Template](#create-template)
- [Delete Template](#delete-template)
- [Duplicate Template](#duplicate-template)
- [Get Template](#get-template)
- [List Templates](#list-templates)
- [Publish Template](#publish-template)
- [Update Template](#update-template)
- [Create Topic](#create-topic)
- [Delete Topic](#delete-topic)
- [Retrieve Topic](#retrieve-topic)
- [List Topics](#list-topics)
- [Update Topic](#update-topic)
- [Create Webhook](#create-webhook)
- [Delete Webhook](#delete-webhook)
- [Retrieve Webhook](#retrieve-webhook)
- [List Webhooks](#list-webhooks)
- [Update Webhook](#update-webhook)
- [Idempotency Keys](#idempotency-keys)
- [Managing Tags](#managing-tags)
- [Migrating from Audiences to Segments](#migrating-from-audiences-to-segments)
- [Using Templates](#using-templates)
- [Examples](#examples)
- [Integrations](#integrations)
- [Introduction](#introduction)
- [Page Not Found](#page-not-found)
- [Page Not Found](#page-not-found)
- [Page Not Found](#page-not-found)
- [Page Not Found](#page-not-found)
- [Introduction](#introduction)
- [Official SDKs](#official-sdks)
- [Security](#security)
- [Send emails with .NET](#send-emails-with-net)
- [Send emails with Elixir](#send-emails-with-elixir)
- [Send emails with Go](#send-emails-with-go)
- [Send emails with Java](#send-emails-with-java)
- [Send emails with Next.js](#send-emails-with-nextjs)
- [Send emails with Node.js](#send-emails-with-nodejs)
- [Send emails with Python](#send-emails-with-python)
- [Send emails with Rails](#send-emails-with-rails)
- [Send emails with Ruby](#send-emails-with-ruby)
- [Send emails with Rust](#send-emails-with-rust)
- [contact.updated](#contactupdated)
- [email.bounced](#emailbounced)
- [email.clicked](#emailclicked)
- [email.received](#emailreceived)
- [Event Types](#event-types)
- [Managing Webhooks](#managing-webhooks)
- [Log in to Resend](#log-in-to-resend)
- [Create a Resend Account](#create-a-resend-account)

---

# Email fordevelopers

- Features

- Company

- Resources

- Help

- Docs

- Pricing

The best way to reach humans instead of spam folders. Deliver transactional and marketing emails at scale.

Companies of all sizes trust Resend to deliver their most important emails.

## Integrate

A simple, elegant interface so you can start sending emails in minutes. It fits right into your code with SDKs for your favorite programming languages.

```tsx
1import { Resend } from 'resend';2
3const resend = new Resend('re_xxxxxxxxx');4
5(async function() {6  const { data, error } = await resend.emails.send({7    from: 'onboarding@resend.dev',8    to: 'delivered@resend.dev',9    subject: 'Hello World',10    html: '<strong>it works!</strong>'11  });12
13  if (error) {14    return console.log(error);15  }16
17  console.log(data);18})();
```

## First-class developer experience

We are a team of engineers who love building tools for other engineers.  Our goal is to create the email platform we've always wished we had — one that just works.

```text
HTTP 200:
```

```json
{ "id": "26abdd24-36a9-475d-83bf-4d27a31c7def" }
```

```text
HTTP 200:
```

```json
{ "id": "cc3817db-d398-4892-8bc0-8bc589a2cfb3" }
```

```text
HTTP 200:
```

```json
{ "id": "4ea2f827-c3a2-471e-b0a1-8bb0bcb5c67c" }
```

```text
HTTP 200:
```

```json
{ "id": "8e1d73b4-ebe1-485d-bce8-0d7044f1d879" }
```

```text
HTTP 200:
```

```json
{ "id": "a08045a6-122a-4e16-ace1-aa81df4278ac" }
```

```text
HTTP 200:
```

```json
{ "id": "c3be1838-b80e-457a-9fc5-3abf49c3b33e" }
```

```text
HTTP 200:
```

```json
{ "id": "13359f77-466e-436d-9cb2-ff0b0c9a8af4" }
```

## Test Mode

Simulate events and experiment with our API without the risk of accidentally sending real emails to real people.

## Modular Webhooks

Receive real-time notifications directly to your server. Every time an email is delivered, opened, bounces, or a link is clicked.

## Write using a delightful editor

A modern editor that makes it easy for anyone to write, format, and send emails.  Visually build your email and change the design by adding custom styles.

## Go beyond editing

Group and control your contacts in a simple and intuitive way.  Straightforward analytics and reporting tools that will help you send better emails.

## Contact Management

Import your list in minutes, regardless the size of your audience. Get full visibility of each contact and their personal attributes.

## Broadcast Analytics

Unlock powerful insights and understand exactly how your audience is interacting with your broadcast emails.

## Develop emails using React

Create beautiful templates without having to deal with <table> layouts and HTML.  Powered by react-email, our open source component library.

```tsx
1import { Body, Button, Column, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Section, Text, Tailwind } from '@react-email/components';2import * as React from 'react';3
4const WelcomeEmail = ({5  username = 'Steve',6  company = 'ACME',7}: WelcomeEmailProps) => {8  const previewText = `Welcome to ${company}, ${username}!`;9
10  return (11    <Html>12      <Head />13      <Preview>{previewText}</Preview>14      <Tailwind>15      <Body className="bg-white my-auto mx-auto font-sans">16        <Container className="my-10 mx-auto p-5 w-[465px]">17          <Section className="mt-8">18            <Img19              src={`${baseUrl}/static/example-logo.png`}20              width="80"21              height="80"22              alt="Logo Example"23              className="my-0 mx-auto"24            />25          </Section>26          <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">27            Welcome to <strong>{company}</strong>, {username}!28          </Heading>29          <Text className="text-sm">30            Hello {username},31          </Text>32          <Text className="text-sm">33            We're excited to have you onboard at <strong>{company}</strong>. We hope you enjoy your journey with us. If you have any questions or need assistance, feel free to reach out.34          </Text>35          <Section className="text-center mt-[32px] mb-[32px]">36              <Button37                pX={20}38                pY={12}39                className="bg-[#00A3FF] rounded-sm text-white text-xs font-semibold no-underline text-center"40                href={`${baseUrl}/get-started`}41              >42                Get Started43              </Button>44          </Section>45          <Text className="text-sm">46            Cheers,47            <br/>48            The {company} Team49          </Text>50        </Container>51      </Body>52      </Tailwind>53    </Html>54  );55};56
57interface WelcomeEmailProps {58  username?: string;59  company?: string;60}61
62const baseUrl = process.env.URL63  ? `https://${process.env.URL}`64  : '';65
66export default WelcomeEmail;
```

## Welcome to ACME, user!

Hello Steve,

We're excited to have you onboard at ACME. We hope you enjoy your journey with us. If you have any questions or need assistance, feel free to reach out.

Cheers,The ACME Team

## Reach humans, not spam folders

#### Proactive blocklist tracking

Be the first to know if your domain is added to a DNSBLs such as those offered by Spamhaus with removal requests generated by Resend.

#### Faster Time to Inbox

Send emails from the region closest to your users. Reduce delivery latency with North American, South American, European, and Asian regions.

#### Build confidence with BIMI

Showcase your logo and company branding with BIMI. Receive guidance to obtain a VMC - the email equivalent of a checkmark on social media.

#### Managed Dedicated IPs

Get a fully managed dedicated IP that automatically warms up and autoscales based on your sending volume, no waiting period.

#### Dynamic suppression list

Prevent repeated sending to recipients who no longer want your email and comply with standards like the CAN-SPAM Act and others.

#### IP and domain monitoring

Monitor your DNS configuration for any errors or regressions. Be notified of any changes that could hinder your deliverability.

#### Verify DNS records

Protect your reputation by verifying your identity as a legitimate sender. Secure your email communication using DKIM and SPF.

#### Battle-tested infrastructure

Rely on a platform of reputable IP's used by trustworthy senders with distributed workloads across different IP pools.

#### Prevent spoofing with DMARC

Avoid impersonation by creating DMARC policies and instructing inbox providers on how to treat unauthenticated email.

> Resend is transforming email for developers. Simple interface, easy integrations, handy templates. What else could we ask for.

Guillermo Rauch

CEO at Vercel

## Everything in your control

All the features you need to manage your email sending, troubleshoot with detailed logs, and protect your domain reputation – without the friction.

#### Intuitive Analytics

#### Full Visibility

#### Domain Authentication

## Beyond expectations

Resend is driving remarkable developer experiences that enable successstories, empower businesses, and fuel growth across industries and individuals.

- "Our team loves Resend. It makes email sending so easy and reliable. After we switched to Dedicated IPs, our deliverability improved tremendously and we don't hear complaints about emails landing on spam anymore."Vlad MatsiiakoVlad MatsiiakoCo-founder of Infisical

- "I've used Mailgun, Sendgrid, and Mandrill and they don't come close to providing the quality of developer experience you get with Resend."Brandon StrittmatterBrandon StrittmatterCo-founder of Outerbase

- "Resend is an amazing product. It was so easy to switch over. I feel confident knowing that our important emails are in good hands with Resend. Everyone should be using this."Shariar KabirShariar KabirFounder at Ruby Card

- "All of our customers are located in South America, so having a solution that could send emails from the region closest to our users is very important. Resend's multi-region feature is a game-changer for us."Giovanni KeppelenGiovanni KeppelenCTO & Partner at VOA Hoteis

- "The speed and ease of integrating with the product was incredible, but what really stood out was their intricate knowledge of email and relentless support day or night. Oh and we also ended up winning Product of the week."Sam DuckerSam DuckerCo-founder of Anyone

- "As a developer I love the approach that the Resend team is taking. Its so refreshing. They are also extremely user-centric and helpful in terms of getting you up and running, sending beautiful emails that deliver."Hahnbee LeeHahnbee LeeCo-Founder at Mintlify

- "The Resend team have built a great product in a space that hasn't seen 10x innovation for years. Engineering peers are raving about Resend - it's such a smoother dev experience."Roberto RiccioRoberto RiccioHead of Product at Alliance

- "If you're a developer or working on a startup, you're going to love Resend's approach to emailing."Joe DeMariaJoe DeMariaCo-founder & CEO of SpecCheck

- "We were up and running with Resend in no time. It was seamless to integrate into our existing workflow and gave us a tremendous amount of visibility into our email capabilities. Simple to say, it was a no-brainer."Ty SharpTy SharpCo-founder & CEO of InBuild

- "Resend not only streamlines our emails to accommodate our expanding customer base, but their team also offered valuable hands-on support during the transition from our old API. Their product is visually stunning and seamlessly integrates with React Email."Thiago CostaThiago CostaCo-founder of Fey and Narative

- "As of our last deployment all of our emails are using Resend. We are loving the development experience of React Email - not having to leave my dev environment to develop new emails is a game-changer."Adam RankinAdam RankinFounding Engineer at Warp

- "Working with Resend has been amazing. By using Webhooks, I'm able to track email opened/clicked events via Segment and log those events in LogSnag for visibility. I highly believe in the people behind Resend."Taylor FacenTaylor FacenFounder of Finta

- "Resend is super easy to set up. Loving the modern approach the team is taking with supercharging email. Never been a fan of other clunky tools."Brek GoinBrek GoinFounder of Hammr

> "Our team loves Resend. It makes email sending so easy and reliable. After we switched to Dedicated IPs, our deliverability improved tremendously and we don't hear complaints about emails landing on spam anymore."Vlad MatsiiakoVlad MatsiiakoCo-founder of Infisical

> "I've used Mailgun, Sendgrid, and Mandrill and they don't come close to providing the quality of developer experience you get with Resend."Brandon StrittmatterBrandon StrittmatterCo-founder of Outerbase

> "Resend is an amazing product. It was so easy to switch over. I feel confident knowing that our important emails are in good hands with Resend. Everyone should be using this."Shariar KabirShariar KabirFounder at Ruby Card

> "All of our customers are located in South America, so having a solution that could send emails from the region closest to our users is very important. Resend's multi-region feature is a game-changer for us."Giovanni KeppelenGiovanni KeppelenCTO & Partner at VOA Hoteis

> "The speed and ease of integrating with the product was incredible, but what really stood out was their intricate knowledge of email and relentless support day or night. Oh and we also ended up winning Product of the week."Sam DuckerSam DuckerCo-founder of Anyone

> "As a developer I love the approach that the Resend team is taking. Its so refreshing. They are also extremely user-centric and helpful in terms of getting you up and running, sending beautiful emails that deliver."Hahnbee LeeHahnbee LeeCo-Founder at Mintlify

> "The Resend team have built a great product in a space that hasn't seen 10x innovation for years. Engineering peers are raving about Resend - it's such a smoother dev experience."Roberto RiccioRoberto RiccioHead of Product at Alliance

> "If you're a developer or working on a startup, you're going to love Resend's approach to emailing."Joe DeMariaJoe DeMariaCo-founder & CEO of SpecCheck

> "We were up and running with Resend in no time. It was seamless to integrate into our existing workflow and gave us a tremendous amount of visibility into our email capabilities. Simple to say, it was a no-brainer."Ty SharpTy SharpCo-founder & CEO of InBuild

> "Resend not only streamlines our emails to accommodate our expanding customer base, but their team also offered valuable hands-on support during the transition from our old API. Their product is visually stunning and seamlessly integrates with React Email."Thiago CostaThiago CostaCo-founder of Fey and Narative

> "As of our last deployment all of our emails are using Resend. We are loving the development experience of React Email - not having to leave my dev environment to develop new emails is a game-changer."Adam RankinAdam RankinFounding Engineer at Warp

> "Working with Resend has been amazing. By using Webhooks, I'm able to track email opened/clicked events via Segment and log those events in LogSnag for visibility. I highly believe in the people behind Resend."Taylor FacenTaylor FacenFounder of Finta

> "Resend is super easy to set up. Loving the modern approach the team is taking with supercharging email. Never been a fan of other clunky tools."Brek GoinBrek GoinFounder of Hammr

- "Our team loves Resend. It makes email sending so easy and reliable. After we switched to Dedicated IPs, our deliverability improved tremendously and we don't hear complaints about emails landing on spam anymore."Vlad MatsiiakoVlad MatsiiakoCo-founder of Infisical

- "I've used Mailgun, Sendgrid, and Mandrill and they don't come close to providing the quality of developer experience you get with Resend."Brandon StrittmatterBrandon StrittmatterCo-founder of Outerbase

- "Resend is an amazing product. It was so easy to switch over. I feel confident knowing that our important emails are in good hands with Resend. Everyone should be using this."Shariar KabirShariar KabirFounder at Ruby Card

- "All of our customers are located in South America, so having a solution that could send emails from the region closest to our users is very important. Resend's multi-region feature is a game-changer for us."Giovanni KeppelenGiovanni KeppelenCTO & Partner at VOA Hoteis

- "The speed and ease of integrating with the product was incredible, but what really stood out was their intricate knowledge of email and relentless support day or night. Oh and we also ended up winning Product of the week."Sam DuckerSam DuckerCo-founder of Anyone

- "As a developer I love the approach that the Resend team is taking. Its so refreshing. They are also extremely user-centric and helpful in terms of getting you up and running, sending beautiful emails that deliver."Hahnbee LeeHahnbee LeeCo-Founder at Mintlify

- "The Resend team have built a great product in a space that hasn't seen 10x innovation for years. Engineering peers are raving about Resend - it's such a smoother dev experience."Roberto RiccioRoberto RiccioHead of Product at Alliance

- "If you're a developer or working on a startup, you're going to love Resend's approach to emailing."Joe DeMariaJoe DeMariaCo-founder & CEO of SpecCheck

- "We were up and running with Resend in no time. It was seamless to integrate into our existing workflow and gave us a tremendous amount of visibility into our email capabilities. Simple to say, it was a no-brainer."Ty SharpTy SharpCo-founder & CEO of InBuild

- "Resend not only streamlines our emails to accommodate our expanding customer base, but their team also offered valuable hands-on support during the transition from our old API. Their product is visually stunning and seamlessly integrates with React Email."Thiago CostaThiago CostaCo-founder of Fey and Narative

- "As of our last deployment all of our emails are using Resend. We are loving the development experience of React Email - not having to leave my dev environment to develop new emails is a game-changer."Adam RankinAdam RankinFounding Engineer at Warp

- "Working with Resend has been amazing. By using Webhooks, I'm able to track email opened/clicked events via Segment and log those events in LogSnag for visibility. I highly believe in the people behind Resend."Taylor FacenTaylor FacenFounder of Finta

- "Resend is super easy to set up. Loving the modern approach the team is taking with supercharging email. Never been a fan of other clunky tools."Brek GoinBrek GoinFounder of Hammr

> "Our team loves Resend. It makes email sending so easy and reliable. After we switched to Dedicated IPs, our deliverability improved tremendously and we don't hear complaints about emails landing on spam anymore."Vlad MatsiiakoVlad MatsiiakoCo-founder of Infisical

> "I've used Mailgun, Sendgrid, and Mandrill and they don't come close to providing the quality of developer experience you get with Resend."Brandon StrittmatterBrandon StrittmatterCo-founder of Outerbase

> "Resend is an amazing product. It was so easy to switch over. I feel confident knowing that our important emails are in good hands with Resend. Everyone should be using this."Shariar KabirShariar KabirFounder at Ruby Card

> "All of our customers are located in South America, so having a solution that could send emails from the region closest to our users is very important. Resend's multi-region feature is a game-changer for us."Giovanni KeppelenGiovanni KeppelenCTO & Partner at VOA Hoteis

> "The speed and ease of integrating with the product was incredible, but what really stood out was their intricate knowledge of email and relentless support day or night. Oh and we also ended up winning Product of the week."Sam DuckerSam DuckerCo-founder of Anyone

> "As a developer I love the approach that the Resend team is taking. Its so refreshing. They are also extremely user-centric and helpful in terms of getting you up and running, sending beautiful emails that deliver."Hahnbee LeeHahnbee LeeCo-Founder at Mintlify

> "The Resend team have built a great product in a space that hasn't seen 10x innovation for years. Engineering peers are raving about Resend - it's such a smoother dev experience."Roberto RiccioRoberto RiccioHead of Product at Alliance

> "If you're a developer or working on a startup, you're going to love Resend's approach to emailing."Joe DeMariaJoe DeMariaCo-founder & CEO of SpecCheck

> "We were up and running with Resend in no time. It was seamless to integrate into our existing workflow and gave us a tremendous amount of visibility into our email capabilities. Simple to say, it was a no-brainer."Ty SharpTy SharpCo-founder & CEO of InBuild

> "Resend not only streamlines our emails to accommodate our expanding customer base, but their team also offered valuable hands-on support during the transition from our old API. Their product is visually stunning and seamlessly integrates with React Email."Thiago CostaThiago CostaCo-founder of Fey and Narative

> "As of our last deployment all of our emails are using Resend. We are loving the development experience of React Email - not having to leave my dev environment to develop new emails is a game-changer."Adam RankinAdam RankinFounding Engineer at Warp

> "Working with Resend has been amazing. By using Webhooks, I'm able to track email opened/clicked events via Segment and log those events in LogSnag for visibility. I highly believe in the people behind Resend."Taylor FacenTaylor FacenFounder of Finta

> "Resend is super easy to set up. Loving the modern approach the team is taking with supercharging email. Never been a fan of other clunky tools."Brek GoinBrek GoinFounder of Hammr

- "Our team loves Resend. It makes email sending so easy and reliable. After we switched to Dedicated IPs, our deliverability improved tremendously and we don't hear complaints about emails landing on spam anymore."Vlad MatsiiakoVlad MatsiiakoCo-founder of Infisical

- "I've used Mailgun, Sendgrid, and Mandrill and they don't come close to providing the quality of developer experience you get with Resend."Brandon StrittmatterBrandon StrittmatterCo-founder of Outerbase

- "Resend is an amazing product. It was so easy to switch over. I feel confident knowing that our important emails are in good hands with Resend. Everyone should be using this."Shariar KabirShariar KabirFounder at Ruby Card

- "All of our customers are located in South America, so having a solution that could send emails from the region closest to our users is very important. Resend's multi-region feature is a game-changer for us."Giovanni KeppelenGiovanni KeppelenCTO & Partner at VOA Hoteis

- "The speed and ease of integrating with the product was incredible, but what really stood out was their intricate knowledge of email and relentless support day or night. Oh and we also ended up winning Product of the week."Sam DuckerSam DuckerCo-founder of Anyone

- "As a developer I love the approach that the Resend team is taking. Its so refreshing. They are also extremely user-centric and helpful in terms of getting you up and running, sending beautiful emails that deliver."Hahnbee LeeHahnbee LeeCo-Founder at Mintlify

- "The Resend team have built a great product in a space that hasn't seen 10x innovation for years. Engineering peers are raving about Resend - it's such a smoother dev experience."Roberto RiccioRoberto RiccioHead of Product at Alliance

- "If you're a developer or working on a startup, you're going to love Resend's approach to emailing."Joe DeMariaJoe DeMariaCo-founder & CEO of SpecCheck

- "We were up and running with Resend in no time. It was seamless to integrate into our existing workflow and gave us a tremendous amount of visibility into our email capabilities. Simple to say, it was a no-brainer."Ty SharpTy SharpCo-founder & CEO of InBuild

- "Resend not only streamlines our emails to accommodate our expanding customer base, but their team also offered valuable hands-on support during the transition from our old API. Their product is visually stunning and seamlessly integrates with React Email."Thiago CostaThiago CostaCo-founder of Fey and Narative

- "As of our last deployment all of our emails are using Resend. We are loving the development experience of React Email - not having to leave my dev environment to develop new emails is a game-changer."Adam RankinAdam RankinFounding Engineer at Warp

- "Working with Resend has been amazing. By using Webhooks, I'm able to track email opened/clicked events via Segment and log those events in LogSnag for visibility. I highly believe in the people behind Resend."Taylor FacenTaylor FacenFounder of Finta

- "Resend is super easy to set up. Loving the modern approach the team is taking with supercharging email. Never been a fan of other clunky tools."Brek GoinBrek GoinFounder of Hammr

> "Our team loves Resend. It makes email sending so easy and reliable. After we switched to Dedicated IPs, our deliverability improved tremendously and we don't hear complaints about emails landing on spam anymore."Vlad MatsiiakoVlad MatsiiakoCo-founder of Infisical

> "I've used Mailgun, Sendgrid, and Mandrill and they don't come close to providing the quality of developer experience you get with Resend."Brandon StrittmatterBrandon StrittmatterCo-founder of Outerbase

> "Resend is an amazing product. It was so easy to switch over. I feel confident knowing that our important emails are in good hands with Resend. Everyone should be using this."Shariar KabirShariar KabirFounder at Ruby Card

> "All of our customers are located in South America, so having a solution that could send emails from the region closest to our users is very important. Resend's multi-region feature is a game-changer for us."Giovanni KeppelenGiovanni KeppelenCTO & Partner at VOA Hoteis

> "The speed and ease of integrating with the product was incredible, but what really stood out was their intricate knowledge of email and relentless support day or night. Oh and we also ended up winning Product of the week."Sam DuckerSam DuckerCo-founder of Anyone

> "As a developer I love the approach that the Resend team is taking. Its so refreshing. They are also extremely user-centric and helpful in terms of getting you up and running, sending beautiful emails that deliver."Hahnbee LeeHahnbee LeeCo-Founder at Mintlify

> "The Resend team have built a great product in a space that hasn't seen 10x innovation for years. Engineering peers are raving about Resend - it's such a smoother dev experience."Roberto RiccioRoberto RiccioHead of Product at Alliance

> "If you're a developer or working on a startup, you're going to love Resend's approach to emailing."Joe DeMariaJoe DeMariaCo-founder & CEO of SpecCheck

> "We were up and running with Resend in no time. It was seamless to integrate into our existing workflow and gave us a tremendous amount of visibility into our email capabilities. Simple to say, it was a no-brainer."Ty SharpTy SharpCo-founder & CEO of InBuild

> "Resend not only streamlines our emails to accommodate our expanding customer base, but their team also offered valuable hands-on support during the transition from our old API. Their product is visually stunning and seamlessly integrates with React Email."Thiago CostaThiago CostaCo-founder of Fey and Narative

> "As of our last deployment all of our emails are using Resend. We are loving the development experience of React Email - not having to leave my dev environment to develop new emails is a game-changer."Adam RankinAdam RankinFounding Engineer at Warp

> "Working with Resend has been amazing. By using Webhooks, I'm able to track email opened/clicked events via Segment and log those events in LogSnag for visibility. I highly believe in the people behind Resend."Taylor FacenTaylor FacenFounder of Finta

> "Resend is super easy to set up. Loving the modern approach the team is taking with supercharging email. Never been a fan of other clunky tools."Brek GoinBrek GoinFounder of Hammr

## Email reimagined.Available today.

2261 Market Street #5039San Francisco, CA 94114

Documentation

- Getting Started

- API Reference

- Integrations

- Examples

- SDKs

Resources

- Changelog

- Pricing

- Security

- SOC 2

- GDPR

- Brand

- Wallpapers

Company

- About

- Blog

- Careers

- Customers

- Events

- Humans

- Philosophy

Help

- Contact

- Support

- Status

- Migrate

- Knowledge Base

- Legal Policies

Handbook

- Why we exist

- How we work

- Engineering

- Design

- Success

- Marketing

*Fonte: [https://resend.com/](https://resend.com/)*

---

# Log in to Resend

By signing in, you agree to our Terms and Privacy Policy.

*Fonte: [https://resend.com/api-keys/](https://resend.com/api-keys/)*

---

# Get in touch

- Features

- Company

- Resources

- Help

- Docs

- Pricing

Get help

support@resend.com

Work at Resend

careers@resend.com

Report security concerns

security@resend.com

2261 Market Street #5039San Francisco, CA 94114

Documentation

- Getting Started

- API Reference

- Integrations

- Examples

- SDKs

Resources

- Changelog

- Pricing

- Security

- SOC 2

- GDPR

- Brand

- Wallpapers

Company

- About

- Blog

- Careers

- Customers

- Events

- Humans

- Philosophy

Help

- Contact

- Support

- Status

- Migrate

- Knowledge Base

- Legal Policies

Handbook

- Why we exist

- How we work

- Engineering

- Design

- Success

- Marketing

*Fonte: [https://resend.com/contact/](https://resend.com/contact/)*

---

# Create API key

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.create({ name: 'Production' });

```

```json
{
  "id": "dacf4072-4119-4d88-932f-6202748ac7c8",
  "token": "re_c1tpEyD8_NKFusih9vKVQknRAQfmFcWCv"
}

```

Add a new API key to authenticate communications with Resend.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.create({ name: 'Production' });

```

```json
{
  "id": "dacf4072-4119-4d88-932f-6202748ac7c8",
  "token": "re_c1tpEyD8_NKFusih9vKVQknRAQfmFcWCv"
}

```

## ​Body Parameters

`full_access`
`sending_access`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.create({ name: 'Production' });

```

```json
{
  "id": "dacf4072-4119-4d88-932f-6202748ac7c8",
  "token": "re_c1tpEyD8_NKFusih9vKVQknRAQfmFcWCv"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/api-keys/create-api-key/](https://resend.com/docs/api-reference/api-keys/create-api-key/)*

---

# Delete API key

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```text
HTTP 200 OK

```

Remove an existing API key.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```text
HTTP 200 OK

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```text
HTTP 200 OK

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/api-keys/delete-api-key/](https://resend.com/docs/api-reference/api-keys/delete-api-key/)*

---

# List API keys

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "91f3200a-df72-4654-b0cd-f202395f5354",
      "name": "Production",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

Retrieve a list of API keys for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "91f3200a-df72-4654-b0cd-f202395f5354",
      "name": "Production",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.apiKeys.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "91f3200a-df72-4654-b0cd-f202395f5354",
      "name": "Production",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/api-keys/list-api-keys/](https://resend.com/docs/api-reference/api-keys/list-api-keys/)*

---

# Create Audience

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.create({
  name: 'Registered Users',
});

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users"
}

```

Create a list of contacts.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.create({
  name: 'Registered Users',
});

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users"
}

```

- Go to the Create Segment page

- Follow the Migration
Guide

## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.create({
  name: 'Registered Users',
});

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/audiences/create-audience/](https://resend.com/docs/api-reference/audiences/create-audience/)*

---

# Delete Audience

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.remove(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

Remove an existing audience.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.remove(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

- Go to the Delete Segment page

- Follow the Migration
Guide

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.remove(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/audiences/delete-audience/](https://resend.com/docs/api-reference/audiences/delete-audience/)*

---

# Retrieve Audience

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.get(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users",
  "created_at": "2023-10-06T22:59:55.977Z"
}

```

Retrieve a single audience.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.get(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users",
  "created_at": "2023-10-06T22:59:55.977Z"
}

```

- Go to the Retrieve Segment page

- Follow the Migration
Guide

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.get(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "audience",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users",
  "created_at": "2023-10-06T22:59:55.977Z"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/audiences/get-audience/](https://resend.com/docs/api-reference/audiences/get-audience/)*

---

# List Audiences

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ]
}

```

Retrieve a list of audiences.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ]
}

```

- Go to the List Segments page

- Follow the Migration
Guide

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.audiences.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/audiences/list-audiences/](https://resend.com/docs/api-reference/audiences/list-audiences/)*

---

# Create Broadcast

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.create({
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  from: 'Acme <[email protected]>',
  subject: 'hello world',
  html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
});

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Create a new broadcast to send to your contacts.

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.create({
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  from: 'Acme <[email protected]>',
  subject: 'hello world',
  html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
});

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

## ​Body Parameters

`"Your Name <[email protected]>"`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.create({
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  from: 'Acme <[email protected]>',
  subject: 'hello world',
  html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
});

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/broadcasts/create-broadcast/](https://resend.com/docs/api-reference/broadcasts/create-broadcast/)*

---

# Delete Broadcast

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.remove(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
);

```

```json
{
  "object": "broadcast",
  "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
  "deleted": true
}

```

Remove an existing broadcast.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.remove(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
);

```

```json
{
  "object": "broadcast",
  "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
  "deleted": true
}

```

`draft`
## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.remove(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
);

```

```json
{
  "object": "broadcast",
  "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/broadcasts/delete-broadcast/](https://resend.com/docs/api-reference/broadcasts/delete-broadcast/)*

---

# Retrieve Broadcast

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.get(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
);

```

```text
{
  "object": "broadcast",
  "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
  "name": "Announcements",
  "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
  "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "from": "Acme <[email protected]>",
  "subject": "hello world",
  "reply_to": null,
  "preview_text": "Check out our latest announcements",
  "html": "<p>Hello {{{FIRST_NAME|there}}}!</p>",
  "text": "Hello {{{FIRST_NAME|there}}}!",
  "status": "draft",
  "created_at": "2024-12-01T19:32:22.980Z",
  "scheduled_at": null,
  "sent_at": null,
  "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Retrieve a single broadcast.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.get(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
);

```

```text
{
  "object": "broadcast",
  "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
  "name": "Announcements",
  "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
  "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "from": "Acme <[email protected]>",
  "subject": "hello world",
  "reply_to": null,
  "preview_text": "Check out our latest announcements",
  "html": "<p>Hello {{{FIRST_NAME|there}}}!</p>",
  "text": "Hello {{{FIRST_NAME|there}}}!",
  "status": "draft",
  "created_at": "2024-12-01T19:32:22.980Z",
  "scheduled_at": null,
  "sent_at": null,
  "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

## ​Path Parameters

`status`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.get(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
);

```

```text
{
  "object": "broadcast",
  "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
  "name": "Announcements",
  "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
  "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "from": "Acme <[email protected]>",
  "subject": "hello world",
  "reply_to": null,
  "preview_text": "Check out our latest announcements",
  "html": "<p>Hello {{{FIRST_NAME|there}}}!</p>",
  "text": "Hello {{{FIRST_NAME|there}}}!",
  "status": "draft",
  "created_at": "2024-12-01T19:32:22.980Z",
  "scheduled_at": null,
  "sent_at": null,
  "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/broadcasts/get-broadcast/](https://resend.com/docs/api-reference/broadcasts/get-broadcast/)*

---

# List Broadcasts

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.list();

```

```text
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
      "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
      "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "status": "draft",
      "created_at": "2024-11-01T15:13:31.723Z",
      "scheduled_at": null,
      "sent_at": null,
      "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
    },
    {
      "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
      "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
      "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "status": "sent",
      "created_at": "2024-12-01T19:32:22.980Z",
      "scheduled_at": "2024-12-02T19:32:22.980Z",
      "sent_at": "2024-12-02T19:32:22.980Z",
      "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
    }
  ]
}

```

Retrieve a list of broadcast.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.list();

```

```text
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
      "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
      "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "status": "draft",
      "created_at": "2024-11-01T15:13:31.723Z",
      "scheduled_at": null,
      "sent_at": null,
      "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
    },
    {
      "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
      "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
      "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "status": "sent",
      "created_at": "2024-12-01T19:32:22.980Z",
      "scheduled_at": "2024-12-02T19:32:22.980Z",
      "sent_at": "2024-12-02T19:32:22.980Z",
      "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
    }
  ]
}

```

`status`
## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.list();

```

```text
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
      "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
      "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "status": "draft",
      "created_at": "2024-11-01T15:13:31.723Z",
      "scheduled_at": null,
      "sent_at": null,
      "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
    },
    {
      "id": "559ac32e-9ef5-46fb-82a1-b76b840c0f7b",
      "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf", // now called segment_id
      "segment_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "status": "sent",
      "created_at": "2024-12-01T19:32:22.980Z",
      "scheduled_at": "2024-12-02T19:32:22.980Z",
      "sent_at": "2024-12-02T19:32:22.980Z",
      "topic_id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/broadcasts/list-broadcasts/](https://resend.com/docs/api-reference/broadcasts/list-broadcasts/)*

---

# Send Broadcast

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.send(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
  {
    scheduledAt: 'in 1 min',
  },
);

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Start sending broadcasts to your audience through the Resend API.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.send(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
  {
    scheduledAt: 'in 1 min',
  },
);

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

## ​Path Parameters

## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.send(
  '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
  {
    scheduledAt: 'in 1 min',
  },
);

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/broadcasts/send-broadcast/](https://resend.com/docs/api-reference/broadcasts/send-broadcast/)*

---

# Update Broadcast

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.update(
  '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
  {
    html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  },
);

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Update a broadcast to send to your contacts.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.update(
  '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
  {
    html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  },
);

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

## ​Path Parameters

## ​Body Parameters

`"Your Name <[email protected]>"`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.broadcasts.update(
  '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
  {
    html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
  },
);

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/broadcasts/update-broadcast/](https://resend.com/docs/api-reference/broadcasts/update-broadcast/)*

---

# Create Contact Property

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.create({
  key: 'company_name',
  type: 'string',
  fallbackValue: 'Acme Corp',
});

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Create a custom property for your contacts.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.create({
  key: 'company_name',
  type: 'string',
  fallbackValue: 'Acme Corp',
});

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.create({
  key: 'company_name',
  type: 'string',
  fallbackValue: 'Acme Corp',
});

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contact-properties/create-contact-property/](https://resend.com/docs/api-reference/contact-properties/create-contact-property/)*

---

# Delete Contact Property

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "deleted": true
}

```

Remove an existing contact property.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "deleted": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contact-properties/delete-contact-property/](https://resend.com/docs/api-reference/contact-properties/delete-contact-property/)*

---

# Retrieve Contact Property

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.get(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "key": "company_name",
  "type": "string",
  "fallback_value": "Acme Corp",
  "created_at": "2023-04-08T00:11:13.110779+00:00"
}

```

Retrieve a contact property by its ID.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.get(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "key": "company_name",
  "type": "string",
  "fallback_value": "Acme Corp",
  "created_at": "2023-04-08T00:11:13.110779+00:00"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.get(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "key": "company_name",
  "type": "string",
  "fallback_value": "Acme Corp",
  "created_at": "2023-04-08T00:11:13.110779+00:00"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contact-properties/get-contact-property/](https://resend.com/docs/api-reference/contact-properties/get-contact-property/)*

---

# List Contact Properties

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "key": "company_name",
      "type": "string",
      "fallback_value": "Acme Corp",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

Retrieve a list of contact properties.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "key": "company_name",
      "type": "string",
      "fallback_value": "Acme Corp",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

## Query Parameters

- Default value: 20

- Maximum value: 100

- Minimum value: 1

`20`
`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "key": "company_name",
      "type": "string",
      "fallback_value": "Acme Corp",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contact-properties/list-contact-properties/](https://resend.com/docs/api-reference/contact-properties/list-contact-properties/)*

---

# Update Contact Property

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.update({
  id: 'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
  fallbackValue: 'Example Company',
});

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Update an existing contact property.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.update({
  id: 'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
  fallbackValue: 'Example Company',
});

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

## ​Path Parameters

`key`
`type`
## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contactProperties.update({
  id: 'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
  fallbackValue: 'Example Company',
});

```

```json
{
  "object": "contact_property",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contact-properties/update-contact-property/](https://resend.com/docs/api-reference/contact-properties/update-contact-property/)*

---

# Add Contact to Segment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Add by contact id
const { data, error } = await resend.contacts.segments.add({
  contactId: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

// Add by contact email
const { data, error } = await resend.contacts.segments.add({
  email: '[email protected]',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

```

```json
{
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf"
}

```

Add an existing contact to a segment.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Add by contact id
const { data, error } = await resend.contacts.segments.add({
  contactId: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

// Add by contact email
const { data, error } = await resend.contacts.segments.add({
  email: '[email protected]',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

```

```json
{
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf"
}

```

## ​Path Parameters

`id`
`email`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Add by contact id
const { data, error } = await resend.contacts.segments.add({
  contactId: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

// Add by contact email
const { data, error } = await resend.contacts.segments.add({
  email: '[email protected]',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

```

```json
{
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/add-contact-to-segment/](https://resend.com/docs/api-reference/contacts/add-contact-to-segment/)*

---

# Create Contact

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.create({
  email: '[email protected]',
  firstName: 'Steve',
  lastName: 'Wozniak',
  unsubscribed: false,
});

```

```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}

```

Create a contact.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.create({
  email: '[email protected]',
  firstName: 'Steve',
  lastName: 'Wozniak',
  unsubscribed: false,
});

```

```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}

```

## ​Body Parameters

`true`
Hide custom properties

Hide segments

Hide topics

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.create({
  email: '[email protected]',
  firstName: 'Steve',
  lastName: 'Wozniak',
  unsubscribed: false,
});

```

```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/create-contact/](https://resend.com/docs/api-reference/contacts/create-contact/)*

---

# Delete Contact Segment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Remove by contact id
const { data, error } = await resend.contacts.segments.remove({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

// Remove by contact email
const { data, error } = await resend.contacts.segments.remove({
  email: '[email protected]',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

```

```json
{
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

Remove an existing contact from a segment.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Remove by contact id
const { data, error } = await resend.contacts.segments.remove({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

// Remove by contact email
const { data, error } = await resend.contacts.segments.remove({
  email: '[email protected]',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

```

```json
{
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

## ​Path Parameters

`id`
`email`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Remove by contact id
const { data, error } = await resend.contacts.segments.remove({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

// Remove by contact email
const { data, error } = await resend.contacts.segments.remove({
  email: '[email protected]',
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
});

```

```json
{
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/delete-contact-segment/](https://resend.com/docs/api-reference/contacts/delete-contact-segment/)*

---

# Delete Contact

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Delete by contact id
const { data, error } = await resend.contacts.remove({
  id: '520784e2-887d-4c25-b53c-4ad46ad38100',
});

// Delete by contact email
const { data, error } = await resend.contacts.remove({
  email: '[email protected]',
});

```

```json
{
  "object": "contact",
  "contact": "520784e2-887d-4c25-b53c-4ad46ad38100",
  "deleted": true
}

```

Remove an existing contact.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Delete by contact id
const { data, error } = await resend.contacts.remove({
  id: '520784e2-887d-4c25-b53c-4ad46ad38100',
});

// Delete by contact email
const { data, error } = await resend.contacts.remove({
  email: '[email protected]',
});

```

```json
{
  "object": "contact",
  "contact": "520784e2-887d-4c25-b53c-4ad46ad38100",
  "deleted": true
}

```

## ​Path Parameters

`id`
`email`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Delete by contact id
const { data, error } = await resend.contacts.remove({
  id: '520784e2-887d-4c25-b53c-4ad46ad38100',
});

// Delete by contact email
const { data, error } = await resend.contacts.remove({
  email: '[email protected]',
});

```

```json
{
  "object": "contact",
  "contact": "520784e2-887d-4c25-b53c-4ad46ad38100",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/delete-contact/](https://resend.com/docs/api-reference/contacts/delete-contact/)*

---

# Retrieve Contact Topics

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Get by contact id
const { data, error } = await resend.contacts.topics.list({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

// Get by contact email
const { data, error } = await resend.contacts.topics.list({
  email: '[email protected]',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "name": "Product Updates",
      "description": "New features, and latest announcements.",
      "subscription": "opt_in"
    }
  ]
}

```

Retrieve a list of topics subscriptions for a contact.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Get by contact id
const { data, error } = await resend.contacts.topics.list({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

// Get by contact email
const { data, error } = await resend.contacts.topics.list({
  email: '[email protected]',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "name": "Product Updates",
      "description": "New features, and latest announcements.",
      "subscription": "opt_in"
    }
  ]
}

```

## ​Path Parameters

`id`
`email`
## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Get by contact id
const { data, error } = await resend.contacts.topics.list({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

// Get by contact email
const { data, error } = await resend.contacts.topics.list({
  email: '[email protected]',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "name": "Product Updates",
      "description": "New features, and latest announcements.",
      "subscription": "opt_in"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/get-contact-topics/](https://resend.com/docs/api-reference/contacts/get-contact-topics/)*

---

# Retrieve Contact

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Get by contact id
const { data, error } = await resend.contacts.get({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

// Get by contact email
const { data, error } = await resend.contacts.get({
  email: '[email protected]',
});

```

```json
{
  "object": "contact",
  "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
  "email": "[email protected]",
  "first_name": "Steve",
  "last_name": "Wozniak",
  "created_at": "2023-10-06T23:47:56.678Z",
  "unsubscribed": false,
  "properties": {
    "company_name": "Acme Corp",
    "department": "Engineering"
  }
}

```

Retrieve a single contact.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Get by contact id
const { data, error } = await resend.contacts.get({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

// Get by contact email
const { data, error } = await resend.contacts.get({
  email: '[email protected]',
});

```

```json
{
  "object": "contact",
  "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
  "email": "[email protected]",
  "first_name": "Steve",
  "last_name": "Wozniak",
  "created_at": "2023-10-06T23:47:56.678Z",
  "unsubscribed": false,
  "properties": {
    "company_name": "Acme Corp",
    "department": "Engineering"
  }
}

```

## ​Path Parameters

`id`
`email`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Get by contact id
const { data, error } = await resend.contacts.get({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

// Get by contact email
const { data, error } = await resend.contacts.get({
  email: '[email protected]',
});

```

```json
{
  "object": "contact",
  "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
  "email": "[email protected]",
  "first_name": "Steve",
  "last_name": "Wozniak",
  "created_at": "2023-10-06T23:47:56.678Z",
  "unsubscribed": false,
  "properties": {
    "company_name": "Acme Corp",
    "department": "Engineering"
  }
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/get-contact/](https://resend.com/docs/api-reference/contacts/get-contact/)*

---

# List Contact Segments

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.segments.list({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

```

```json
{
  "object": "list",
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ],
  "has_more": false
}

```

Retrieve a list of segments that a contact is part of.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.segments.list({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

```

```json
{
  "object": "list",
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ],
  "has_more": false
}

```

## ​Path Parameters

`id`
`email`
## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.segments.list({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
});

```

```json
{
  "object": "list",
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ],
  "has_more": false
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/list-contact-segments/](https://resend.com/docs/api-reference/contacts/list-contact-segments/)*

---

# List Contacts

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "email": "[email protected]",
      "first_name": "Steve",
      "last_name": "Wozniak",
      "created_at": "2023-10-06T23:47:56.678Z",
      "unsubscribed": false,
      "properties": {
        "company_name": "Acme Corp",
        "department": "Engineering"
      }
    }
  ]
}

```

Show all contacts.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "email": "[email protected]",
      "first_name": "Steve",
      "last_name": "Wozniak",
      "created_at": "2023-10-06T23:47:56.678Z",
      "unsubscribed": false,
      "properties": {
        "company_name": "Acme Corp",
        "department": "Engineering"
      }
    }
  ]
}

```

## ​Path Parameters

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.contacts.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "email": "[email protected]",
      "first_name": "Steve",
      "last_name": "Wozniak",
      "created_at": "2023-10-06T23:47:56.678Z",
      "unsubscribed": false,
      "properties": {
        "company_name": "Acme Corp",
        "department": "Engineering"
      }
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/list-contacts/](https://resend.com/docs/api-reference/contacts/list-contacts/)*

---

# Update Contact Topics

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Update by contact id
const { data, error } = await resend.contacts.topics.update({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  topics: [
    {
      id: 'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
      subscription: 'opt_out',
    },
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_in',
    },
  ],
});

// Update by contact email
const { data, error } = await resend.contacts.topics.update({
  email: '[email protected]',
  topics: [
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_out',
    },
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_in',
    },
  ],
});

```

```json
{
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Update topic subscriptions for a contact.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Update by contact id
const { data, error } = await resend.contacts.topics.update({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  topics: [
    {
      id: 'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
      subscription: 'opt_out',
    },
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_in',
    },
  ],
});

// Update by contact email
const { data, error } = await resend.contacts.topics.update({
  email: '[email protected]',
  topics: [
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_out',
    },
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_in',
    },
  ],
});

```

```json
{
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

## ​Path Parameters

`id`
`email`
## ​Body Parameters

Hide properties

`opt_in`
`opt_out`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Update by contact id
const { data, error } = await resend.contacts.topics.update({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  topics: [
    {
      id: 'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
      subscription: 'opt_out',
    },
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_in',
    },
  ],
});

// Update by contact email
const { data, error } = await resend.contacts.topics.update({
  email: '[email protected]',
  topics: [
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_out',
    },
    {
      id: '07d84122-7224-4881-9c31-1c048e204602',
      subscription: 'opt_in',
    },
  ],
});

```

```json
{
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/update-contact-topics/](https://resend.com/docs/api-reference/contacts/update-contact-topics/)*

---

# Update Contact

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Update by contact id
const { data, error } = await resend.contacts.update({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  unsubscribed: true,
});

// Update by contact email
const { data, error } = await resend.contacts.update({
  email: '[email protected]',
  unsubscribed: true,
});

```

```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}

```

Update an existing contact.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Update by contact id
const { data, error } = await resend.contacts.update({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  unsubscribed: true,
});

// Update by contact email
const { data, error } = await resend.contacts.update({
  email: '[email protected]',
  unsubscribed: true,
});

```

```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}

```

## ​Path Parameters

`id`
`email`
## ​Body Parameters

`true`
Hide custom properties

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

// Update by contact id
const { data, error } = await resend.contacts.update({
  id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
  unsubscribed: true,
});

// Update by contact email
const { data, error } = await resend.contacts.update({
  email: '[email protected]',
  unsubscribed: true,
});

```

```json
{
  "object": "contact",
  "id": "479e3145-dd38-476b-932c-529ceb705947"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/contacts/update-contact/](https://resend.com/docs/api-reference/contacts/update-contact/)*

---

# Create Domain

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.create({ name: 'example.com' });

```

```json
{
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "name": "example.com",
  "created_at": "2023-03-28T17:12:02.059593+00:00",
  "status": "not_started",
  "capabilities": {
    "sending": "enabled",
    "receiving": "disabled"
  },
  "records": [
    {
      "record": "SPF",
      "name": "send",
      "type": "MX",
      "ttl": "Auto",
      "status": "not_started",
      "value": "feedback-smtp.us-east-1.amazonses.com",
      "priority": 10
    },
    {
      "record": "SPF",
      "name": "send",
      "value": "\"v=spf1 include:amazonses.com ~all\"",
      "type": "TXT",
      "ttl": "Auto",
      "status": "not_started"
    },
    {
      "record": "DKIM",
      "name": "nhapbbryle57yxg3fbjytyodgbt2kyyg._domainkey",
      "value": "nhapbbryle57yxg3fbjytyodgbt2kyyg.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    },
    {
      "record": "DKIM",
      "name": "xbakwbe5fcscrhzshpap6kbxesf6pfgn._domainkey",
      "value": "xbakwbe5fcscrhzshpap6kbxesf6pfgn.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    },
    {
      "record": "DKIM",
      "name": "txrcreso3dqbvcve45tqyosxwaegvhgn._domainkey",
      "value": "txrcreso3dqbvcve45tqyosxwaegvhgn.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    }
  ],
  "region": "us-east-1"
}

```

Create a domain through the Resend Email API.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.create({ name: 'example.com' });

```

```json
{
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "name": "example.com",
  "created_at": "2023-03-28T17:12:02.059593+00:00",
  "status": "not_started",
  "capabilities": {
    "sending": "enabled",
    "receiving": "disabled"
  },
  "records": [
    {
      "record": "SPF",
      "name": "send",
      "type": "MX",
      "ttl": "Auto",
      "status": "not_started",
      "value": "feedback-smtp.us-east-1.amazonses.com",
      "priority": 10
    },
    {
      "record": "SPF",
      "name": "send",
      "value": "\"v=spf1 include:amazonses.com ~all\"",
      "type": "TXT",
      "ttl": "Auto",
      "status": "not_started"
    },
    {
      "record": "DKIM",
      "name": "nhapbbryle57yxg3fbjytyodgbt2kyyg._domainkey",
      "value": "nhapbbryle57yxg3fbjytyodgbt2kyyg.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    },
    {
      "record": "DKIM",
      "name": "xbakwbe5fcscrhzshpap6kbxesf6pfgn._domainkey",
      "value": "xbakwbe5fcscrhzshpap6kbxesf6pfgn.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    },
    {
      "record": "DKIM",
      "name": "txrcreso3dqbvcve45tqyosxwaegvhgn._domainkey",
      "value": "txrcreso3dqbvcve45tqyosxwaegvhgn.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    }
  ],
  "region": "us-east-1"
}

```

## ​Body Parameters

`'us-east-1' |     'eu-west-1' | 'sa-east-1' | 'ap-northeast-1'`
- opportunistic: Opportunistic TLS means that it always attempts to make a
secure connection to the receiving mail server. If it can’t establish a
secure connection, it sends the message unencrypted.

- enforced: Enforced TLS on the other hand, requires that the email
communication must use TLS no matter what. If the receiving server does
not support TLS, the email will not be sent.

`opportunistic`
`enforced`
Show properties

`'enabled' | 'disabled'`
`'enabled' | 'disabled'`
`status`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.create({ name: 'example.com' });

```

```json
{
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "name": "example.com",
  "created_at": "2023-03-28T17:12:02.059593+00:00",
  "status": "not_started",
  "capabilities": {
    "sending": "enabled",
    "receiving": "disabled"
  },
  "records": [
    {
      "record": "SPF",
      "name": "send",
      "type": "MX",
      "ttl": "Auto",
      "status": "not_started",
      "value": "feedback-smtp.us-east-1.amazonses.com",
      "priority": 10
    },
    {
      "record": "SPF",
      "name": "send",
      "value": "\"v=spf1 include:amazonses.com ~all\"",
      "type": "TXT",
      "ttl": "Auto",
      "status": "not_started"
    },
    {
      "record": "DKIM",
      "name": "nhapbbryle57yxg3fbjytyodgbt2kyyg._domainkey",
      "value": "nhapbbryle57yxg3fbjytyodgbt2kyyg.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    },
    {
      "record": "DKIM",
      "name": "xbakwbe5fcscrhzshpap6kbxesf6pfgn._domainkey",
      "value": "xbakwbe5fcscrhzshpap6kbxesf6pfgn.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    },
    {
      "record": "DKIM",
      "name": "txrcreso3dqbvcve45tqyosxwaegvhgn._domainkey",
      "value": "txrcreso3dqbvcve45tqyosxwaegvhgn.dkim.amazonses.com.",
      "type": "CNAME",
      "status": "not_started",
      "ttl": "Auto"
    }
  ],
  "region": "us-east-1"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/domains/create-domain/](https://resend.com/docs/api-reference/domains/create-domain/)*

---

# Delete Domain

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.remove(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
  "deleted": true
}

```

Remove an existing domain.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.remove(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
  "deleted": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.remove(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/domains/delete-domain/](https://resend.com/docs/api-reference/domains/delete-domain/)*

---

# Retrieve Domain

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.get(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
  "name": "example.com",
  "status": "not_started",
  "created_at": "2023-04-26T20:21:26.347412+00:00",
  "region": "us-east-1",
  "capabilities": {
    "sending": "enabled",
    "receiving": "disabled"
  },
  "records": [
    {
      "record": "SPF",
      "name": "send",
      "type": "MX",
      "ttl": "Auto",
      "status": "not_started",
      "value": "feedback-smtp.us-east-1.amazonses.com",
      "priority": 10
    },
    {
      "record": "SPF",
      "name": "send",
      "value": "\"v=spf1 include:amazonses.com ~all\"",
      "type": "TXT",
      "ttl": "Auto",
      "status": "not_started"
    },
    {
      "record": "DKIM",
      "name": "resend._domainkey",
      "value": "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsc4Lh8xilsngyKEgN2S84+21gn+x6SEXtjWvPiAAmnmggr5FWG42WnqczpzQ/mNblqHz4CDwUum6LtY6SdoOlDmrhvp5khA3cd661W9FlK3yp7+jVACQElS7d9O6jv8VsBbVg4COess3gyLE5RyxqF1vYsrEXqyM8TBz1n5AGkQIDAQA2",
      "type": "TXT",
      "status": "not_started",
      "ttl": "Auto"
    }
  ]
}

```

Retrieve a single domain for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.get(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
  "name": "example.com",
  "status": "not_started",
  "created_at": "2023-04-26T20:21:26.347412+00:00",
  "region": "us-east-1",
  "capabilities": {
    "sending": "enabled",
    "receiving": "disabled"
  },
  "records": [
    {
      "record": "SPF",
      "name": "send",
      "type": "MX",
      "ttl": "Auto",
      "status": "not_started",
      "value": "feedback-smtp.us-east-1.amazonses.com",
      "priority": 10
    },
    {
      "record": "SPF",
      "name": "send",
      "value": "\"v=spf1 include:amazonses.com ~all\"",
      "type": "TXT",
      "ttl": "Auto",
      "status": "not_started"
    },
    {
      "record": "DKIM",
      "name": "resend._domainkey",
      "value": "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsc4Lh8xilsngyKEgN2S84+21gn+x6SEXtjWvPiAAmnmggr5FWG42WnqczpzQ/mNblqHz4CDwUum6LtY6SdoOlDmrhvp5khA3cd661W9FlK3yp7+jVACQElS7d9O6jv8VsBbVg4COess3gyLE5RyxqF1vYsrEXqyM8TBz1n5AGkQIDAQA2",
      "type": "TXT",
      "status": "not_started",
      "ttl": "Auto"
    }
  ]
}

```

## ​Path Parameters

`status`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.get(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
  "name": "example.com",
  "status": "not_started",
  "created_at": "2023-04-26T20:21:26.347412+00:00",
  "region": "us-east-1",
  "capabilities": {
    "sending": "enabled",
    "receiving": "disabled"
  },
  "records": [
    {
      "record": "SPF",
      "name": "send",
      "type": "MX",
      "ttl": "Auto",
      "status": "not_started",
      "value": "feedback-smtp.us-east-1.amazonses.com",
      "priority": 10
    },
    {
      "record": "SPF",
      "name": "send",
      "value": "\"v=spf1 include:amazonses.com ~all\"",
      "type": "TXT",
      "ttl": "Auto",
      "status": "not_started"
    },
    {
      "record": "DKIM",
      "name": "resend._domainkey",
      "value": "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDsc4Lh8xilsngyKEgN2S84+21gn+x6SEXtjWvPiAAmnmggr5FWG42WnqczpzQ/mNblqHz4CDwUum6LtY6SdoOlDmrhvp5khA3cd661W9FlK3yp7+jVACQElS7d9O6jv8VsBbVg4COess3gyLE5RyxqF1vYsrEXqyM8TBz1n5AGkQIDAQA2",
      "type": "TXT",
      "status": "not_started",
      "ttl": "Auto"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/domains/get-domain/](https://resend.com/docs/api-reference/domains/get-domain/)*

---

# List Domains

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
      "name": "example.com",
      "status": "not_started",
      "created_at": "2023-04-26T20:21:26.347412+00:00",
      "region": "us-east-1",
      "capabilities": {
        "sending": "enabled",
        "receiving": "disabled"
      }
    }
  ]
}

```

Retrieve a list of domains for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
      "name": "example.com",
      "status": "not_started",
      "created_at": "2023-04-26T20:21:26.347412+00:00",
      "region": "us-east-1",
      "capabilities": {
        "sending": "enabled",
        "receiving": "disabled"
      }
    }
  ]
}

```

`status`
## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "d91cd9bd-1176-453e-8fc1-35364d380206",
      "name": "example.com",
      "status": "not_started",
      "created_at": "2023-04-26T20:21:26.347412+00:00",
      "region": "us-east-1",
      "capabilities": {
        "sending": "enabled",
        "receiving": "disabled"
      }
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/domains/list-domains/](https://resend.com/docs/api-reference/domains/list-domains/)*

---

# Update Domain

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.update({
  id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
  openTracking: false,
  clickTracking: true,
  tls: 'enforced',
});

```

```json
{
  "object": "domain",
  "id": "b8617ad3-b712-41d9-81a0-f7c3d879314e"
}

```

Update an existing domain.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.update({
  id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
  openTracking: false,
  clickTracking: true,
  tls: 'enforced',
});

```

```json
{
  "object": "domain",
  "id": "b8617ad3-b712-41d9-81a0-f7c3d879314e"
}

```

## ​Path Parameters

## ​Body Parameters

- opportunistic: Opportunistic TLS means that it always attempts to make a
secure connection to the receiving mail server. If it can’t establish a
secure connection, it sends the message unencrypted.

- enforced: Enforced TLS on the other hand, requires that the email
communication must use TLS no matter what. If the receiving server does
not support TLS, the email will not be sent.

`opportunistic`
`enforced`
Show properties

`'enabled' | 'disabled'`
`'enabled' | 'disabled'`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.update({
  id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
  openTracking: false,
  clickTracking: true,
  tls: 'enforced',
});

```

```json
{
  "object": "domain",
  "id": "b8617ad3-b712-41d9-81a0-f7c3d879314e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/domains/update-domain/](https://resend.com/docs/api-reference/domains/update-domain/)*

---

# Verify Domain

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.verify(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206"
}

```

Verify an existing domain.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.verify(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.domains.verify(
  'd91cd9bd-1176-453e-8fc1-35364d380206',
);

```

```json
{
  "object": "domain",
  "id": "d91cd9bd-1176-453e-8fc1-35364d380206"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/domains/verify-domain/](https://resend.com/docs/api-reference/domains/verify-domain/)*

---

# Cancel Email

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.cancel(
  '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
);

```

```json
{
  "object": "email",
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Cancel a scheduled email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.cancel(
  '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
);

```

```json
{
  "object": "email",
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.cancel(
  '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
);

```

```json
{
  "object": "email",
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/cancel-email/](https://resend.com/docs/api-reference/emails/cancel-email/)*

---

# List Attachments

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.attachments.list({
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "size": 4096,
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001",
      "download_url": "https://outbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
      "expires_at": "2025-10-17T14:29:41.521Z"
    }
  ]
}

```

Retrieve a list of attachments from a sent email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.attachments.list({
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "size": 4096,
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001",
      "download_url": "https://outbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
      "expires_at": "2025-10-17T14:29:41.521Z"
    }
  ]
}

```

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.attachments.list({
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "size": 4096,
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001",
      "download_url": "https://outbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
      "expires_at": "2025-10-17T14:29:41.521Z"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/list-email-attachments/](https://resend.com/docs/api-reference/emails/list-email-attachments/)*

---

# List Sent Emails

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
      "to": ["[email protected]"],
      "from": "Acme <[email protected]>",
      "created_at": "2023-04-03T22:13:42.674981+00:00",
      "subject": "Hello World",
      "bcc": null,
      "cc": null,
      "reply_to": null,
      "last_event": "delivered",
      "scheduled_at": null
    },
    {
      "id": "3a9f8c2b-1e5d-4f8a-9c7b-2d6e5f8a9c7b",
      "to": ["[email protected]"],
      "from": "Acme <[email protected]>",
      "created_at": "2023-04-03T21:45:12.345678+00:00",
      "subject": "Welcome to Acme",
      "bcc": null,
      "cc": null,
      "reply_to": null,
      "last_event": "opened",
      "scheduled_at": null
    }
  ]
}

```

Retrieve a list of emails sent by your team.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
      "to": ["[email protected]"],
      "from": "Acme <[email protected]>",
      "created_at": "2023-04-03T22:13:42.674981+00:00",
      "subject": "Hello World",
      "bcc": null,
      "cc": null,
      "reply_to": null,
      "last_event": "delivered",
      "scheduled_at": null
    },
    {
      "id": "3a9f8c2b-1e5d-4f8a-9c7b-2d6e5f8a9c7b",
      "to": ["[email protected]"],
      "from": "Acme <[email protected]>",
      "created_at": "2023-04-03T21:45:12.345678+00:00",
      "subject": "Welcome to Acme",
      "bcc": null,
      "cc": null,
      "reply_to": null,
      "last_event": "opened",
      "scheduled_at": null
    }
  ]
}

```

`id`
## Query Parameters

- Default value: 20

- Maximum value: 100

- Minimum value: 1

`20`
`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
      "to": ["[email protected]"],
      "from": "Acme <[email protected]>",
      "created_at": "2023-04-03T22:13:42.674981+00:00",
      "subject": "Hello World",
      "bcc": null,
      "cc": null,
      "reply_to": null,
      "last_event": "delivered",
      "scheduled_at": null
    },
    {
      "id": "3a9f8c2b-1e5d-4f8a-9c7b-2d6e5f8a9c7b",
      "to": ["[email protected]"],
      "from": "Acme <[email protected]>",
      "created_at": "2023-04-03T21:45:12.345678+00:00",
      "subject": "Welcome to Acme",
      "bcc": null,
      "cc": null,
      "reply_to": null,
      "last_event": "opened",
      "scheduled_at": null
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/list-emails/](https://resend.com/docs/api-reference/emails/list-emails/)*

---

# List Attachments

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.attachments.list({
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "size": 4096,
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001",
      "download_url": "https://inbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
      "expires_at": "2025-10-17T14:29:41.521Z"
    }
  ]
}

```

Retrieve a list of attachments from a received email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.attachments.list({
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "size": 4096,
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001",
      "download_url": "https://inbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
      "expires_at": "2025-10-17T14:29:41.521Z"
    }
  ]
}

```

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.attachments.list({
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "size": 4096,
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001",
      "download_url": "https://inbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
      "expires_at": "2025-10-17T14:29:41.521Z"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/list-received-email-attachments/](https://resend.com/docs/api-reference/emails/list-received-email-attachments/)*

---

# List Received Emails

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.list();

```

```json
{
  "object": "list",
  "has_more": true,
  "data": [
    {
      "id": "a39999a6-88e3-48b1-888b-beaabcde1b33",
      "to": ["[email protected]"],
      "from": "[email protected]",
      "created_at": "2025-10-09 14:37:40.951732+00",
      "subject": "Hello World",
      "bcc": [],
      "cc": [],
      "reply_to": [],
      "message_id": "<[email protected]>",
      "attachments": [
        {
          "filename": "example.txt",
          "content_type": "text/plain",
          "content_id": null,
          "content_disposition": "attachment",
          "id": "47e999c7-c89c-4999-bf32-aaaaa1c3ff21",
          "size": 13
        }
      ]
    }
  ]
}

```

Retrieve a list of received emails for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.list();

```

```json
{
  "object": "list",
  "has_more": true,
  "data": [
    {
      "id": "a39999a6-88e3-48b1-888b-beaabcde1b33",
      "to": ["[email protected]"],
      "from": "[email protected]",
      "created_at": "2025-10-09 14:37:40.951732+00",
      "subject": "Hello World",
      "bcc": [],
      "cc": [],
      "reply_to": [],
      "message_id": "<[email protected]>",
      "attachments": [
        {
          "filename": "example.txt",
          "content_type": "text/plain",
          "content_id": null,
          "content_disposition": "attachment",
          "id": "47e999c7-c89c-4999-bf32-aaaaa1c3ff21",
          "size": 13
        }
      ]
    }
  ]
}

```

`id`
## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.list();

```

```json
{
  "object": "list",
  "has_more": true,
  "data": [
    {
      "id": "a39999a6-88e3-48b1-888b-beaabcde1b33",
      "to": ["[email protected]"],
      "from": "[email protected]",
      "created_at": "2025-10-09 14:37:40.951732+00",
      "subject": "Hello World",
      "bcc": [],
      "cc": [],
      "reply_to": [],
      "message_id": "<[email protected]>",
      "attachments": [
        {
          "filename": "example.txt",
          "content_type": "text/plain",
          "content_id": null,
          "content_disposition": "attachment",
          "id": "47e999c7-c89c-4999-bf32-aaaaa1c3ff21",
          "size": 13
        }
      ]
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/list-received-emails/](https://resend.com/docs/api-reference/emails/list-received-emails/)*

---

# Retrieve Attachment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.attachments.get({
  id: '2a0c9ce0-3112-4728-976e-47ddcd16a318',
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "attachment",
  "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
  "filename": "avatar.png",
  "size": 4096,
  "content_type": "image/png",
  "content_disposition": "inline",
  "content_id": "img001",
  "download_url": "https://outbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
  "expires_at": "2025-10-17T14:29:41.521Z"
}

```

Retrieve a single attachment from a sent email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.attachments.get({
  id: '2a0c9ce0-3112-4728-976e-47ddcd16a318',
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "attachment",
  "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
  "filename": "avatar.png",
  "size": 4096,
  "content_type": "image/png",
  "content_disposition": "inline",
  "content_id": "img001",
  "download_url": "https://outbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
  "expires_at": "2025-10-17T14:29:41.521Z"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.attachments.get({
  id: '2a0c9ce0-3112-4728-976e-47ddcd16a318',
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "attachment",
  "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
  "filename": "avatar.png",
  "size": 4096,
  "content_type": "image/png",
  "content_disposition": "inline",
  "content_id": "img001",
  "download_url": "https://outbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
  "expires_at": "2025-10-17T14:29:41.521Z"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/retrieve-email-attachment/](https://resend.com/docs/api-reference/emails/retrieve-email-attachment/)*

---

# Retrieve Email

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.get(
  '37e4414c-5e25-4dbc-a071-43552a4bd53b',
);

```

```json
{
  "object": "email",
  "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
  "to": ["[email protected]"],
  "from": "Acme <[email protected]>",
  "created_at": "2023-04-03T22:13:42.674981+00:00",
  "subject": "Hello World",
  "html": "Congrats on sending your <strong>first email</strong>!",
  "text": null,
  "bcc": [],
  "cc": [],
  "reply_to": [],
  "last_event": "delivered",
  "scheduled_at": null,
  "tags": [
    {
      "name": "category",
      "value": "confirm_email"
    }
  ]
}

```

Retrieve a single email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.get(
  '37e4414c-5e25-4dbc-a071-43552a4bd53b',
);

```

```json
{
  "object": "email",
  "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
  "to": ["[email protected]"],
  "from": "Acme <[email protected]>",
  "created_at": "2023-04-03T22:13:42.674981+00:00",
  "subject": "Hello World",
  "html": "Congrats on sending your <strong>first email</strong>!",
  "text": null,
  "bcc": [],
  "cc": [],
  "reply_to": [],
  "last_event": "delivered",
  "scheduled_at": null,
  "tags": [
    {
      "name": "category",
      "value": "confirm_email"
    }
  ]
}

```

## ​Path Parameters

`last_event`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.get(
  '37e4414c-5e25-4dbc-a071-43552a4bd53b',
);

```

```json
{
  "object": "email",
  "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
  "to": ["[email protected]"],
  "from": "Acme <[email protected]>",
  "created_at": "2023-04-03T22:13:42.674981+00:00",
  "subject": "Hello World",
  "html": "Congrats on sending your <strong>first email</strong>!",
  "text": null,
  "bcc": [],
  "cc": [],
  "reply_to": [],
  "last_event": "delivered",
  "scheduled_at": null,
  "tags": [
    {
      "name": "category",
      "value": "confirm_email"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/retrieve-email/](https://resend.com/docs/api-reference/emails/retrieve-email/)*

---

# Retrieve Attachment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.attachments.get({
  id: '2a0c9ce0-3112-4728-976e-47ddcd16a318',
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "attachment",
  "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
  "filename": "avatar.png",
  "size": 4096,
  "content_type": "image/png",
  "content_disposition": "inline",
  "content_id": "img001",
  "download_url": "https://inbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
  "expires_at": "2025-10-17T14:29:41.521Z"
}

```

Retrieve a single attachment from a received email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.attachments.get({
  id: '2a0c9ce0-3112-4728-976e-47ddcd16a318',
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "attachment",
  "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
  "filename": "avatar.png",
  "size": 4096,
  "content_type": "image/png",
  "content_disposition": "inline",
  "content_id": "img001",
  "download_url": "https://inbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
  "expires_at": "2025-10-17T14:29:41.521Z"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.attachments.get({
  id: '2a0c9ce0-3112-4728-976e-47ddcd16a318',
  emailId: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
});

```

```json
{
  "object": "attachment",
  "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
  "filename": "avatar.png",
  "size": 4096,
  "content_type": "image/png",
  "content_disposition": "inline",
  "content_id": "img001",
  "download_url": "https://inbound-cdn.resend.com/4ef9a417-02e9-4d39-ad75-9611e0fcc33c/attachments/2a0c9ce0-3112-4728-976e-47ddcd16a318?some-params=example&signature=sig-123",
  "expires_at": "2025-10-17T14:29:41.521Z"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/retrieve-received-email-attachment/](https://resend.com/docs/api-reference/emails/retrieve-received-email-attachment/)*

---

# Retrieve Received Email

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.get(
  '37e4414c-5e25-4dbc-a071-43552a4bd53b',
);

```

```json
{
  "object": "email",
  "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
  "to": ["[email protected]"],
  "from": "Acme <[email protected]>",
  "created_at": "2023-04-03T22:13:42.674981+00:00",
  "subject": "Hello World",
  "html": "Congrats on sending your <strong>first email</strong>!",
  "text": null,
  "headers": {
    "return-path": "[email protected]",
    "mime-version": "1.0"
  },
  "bcc": [],
  "cc": [],
  "reply_to": [],
  "message_id": "<example+123>",
  "raw": {
    "download_url": "https://example.resend.com/receiving/raw/054da427-439a-4e91-b785-e4fb1966285f?Signature=...",
    "expires_at": "2023-04-03T23:13:42.674981+00:00"
  },
  "attachments": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001"
    }
  ]
}

```

Retrieve a single received email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.get(
  '37e4414c-5e25-4dbc-a071-43552a4bd53b',
);

```

```json
{
  "object": "email",
  "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
  "to": ["[email protected]"],
  "from": "Acme <[email protected]>",
  "created_at": "2023-04-03T22:13:42.674981+00:00",
  "subject": "Hello World",
  "html": "Congrats on sending your <strong>first email</strong>!",
  "text": null,
  "headers": {
    "return-path": "[email protected]",
    "mime-version": "1.0"
  },
  "bcc": [],
  "cc": [],
  "reply_to": [],
  "message_id": "<example+123>",
  "raw": {
    "download_url": "https://example.resend.com/receiving/raw/054da427-439a-4e91-b785-e4fb1966285f?Signature=...",
    "expires_at": "2023-04-03T23:13:42.674981+00:00"
  },
  "attachments": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001"
    }
  ]
}

```

## ​Path Parameters

## ​Response Parameters

Hide properties

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.receiving.get(
  '37e4414c-5e25-4dbc-a071-43552a4bd53b',
);

```

```json
{
  "object": "email",
  "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
  "to": ["[email protected]"],
  "from": "Acme <[email protected]>",
  "created_at": "2023-04-03T22:13:42.674981+00:00",
  "subject": "Hello World",
  "html": "Congrats on sending your <strong>first email</strong>!",
  "text": null,
  "headers": {
    "return-path": "[email protected]",
    "mime-version": "1.0"
  },
  "bcc": [],
  "cc": [],
  "reply_to": [],
  "message_id": "<example+123>",
  "raw": {
    "download_url": "https://example.resend.com/receiving/raw/054da427-439a-4e91-b785-e4fb1966285f?Signature=...",
    "expires_at": "2023-04-03T23:13:42.674981+00:00"
  },
  "attachments": [
    {
      "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
      "filename": "avatar.png",
      "content_type": "image/png",
      "content_disposition": "inline",
      "content_id": "img001"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/retrieve-received-email/](https://resend.com/docs/api-reference/emails/retrieve-received-email/)*

---

# Send Batch Emails

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.batch.send([
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'hello world',
    html: '<h1>it works!</h1>',
  },
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'world hello',
    html: '<p>it works!</p>',
  },
]);

```

```json
{
  "data": [
    {
      "id": "ae2014de-c168-4c61-8267-70d2662a1ce1"
    },
    {
      "id": "faccb7a5-8a28-4e9a-ac64-8da1cc3bc1cb"
    }
  ]
}

```

Trigger up to 100 batch emails at once.

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.batch.send([
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'hello world',
    html: '<h1>it works!</h1>',
  },
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'world hello',
    html: '<p>it works!</p>',
  },
]);

```

```json
{
  "data": [
    {
      "id": "ae2014de-c168-4c61-8267-70d2662a1ce1"
    },
    {
      "id": "faccb7a5-8a28-4e9a-ac64-8da1cc3bc1cb"
    }
  ]
}

```

## ​Body Parameters

`"Your Name <[email protected]>"`
Hide properties

`template`
- id: the id or the alias of the published template

- variables: an object with a key for each variable (if applicable)

`id`
`variables`
`template`
`html`
`text`
`react`
`from`
`subject`
`reply_to`
`template`
```text
variables: {
	CTA: 'Sign up now',
	CTA_LINK: 'https://example.com/signup'
}

```

Hide properties

`FIRST_NAME`
`LAST_NAME`
`EMAIL`
`UNSUBSCRIBE_URL`
- string: maximum length of 2,000 characters

- number: not greater than 2^53 - 1

`string`
`number`
## ​Headers

- Should be unique per API request

- Idempotency keys expire after 24 hours

- Have a maximum length of 256 characters

## ​Limitations

`attachments`
`scheduled_at`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.batch.send([
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'hello world',
    html: '<h1>it works!</h1>',
  },
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'world hello',
    html: '<p>it works!</p>',
  },
]);

```

```json
{
  "data": [
    {
      "id": "ae2014de-c168-4c61-8267-70d2662a1ce1"
    },
    {
      "id": "faccb7a5-8a28-4e9a-ac64-8da1cc3bc1cb"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/send-batch-emails/](https://resend.com/docs/api-reference/emails/send-batch-emails/)*

---

# Send Email

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.send({
  from: 'Acme <[email protected]>',
  to: ['[email protected]'],
  subject: 'hello world',
  html: '<p>it works!</p>',
  replyTo: '[email protected]',
});

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Start sending emails through the Resend Email API.

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.send({
  from: 'Acme <[email protected]>',
  to: ['[email protected]'],
  subject: 'hello world',
  html: '<p>it works!</p>',
  replyTo: '[email protected]',
});

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

## ​Body Parameters

`"Your Name <[email protected]>"`
Hide properties

Hide properties

`template`
- id: the id or the alias of the published template

- variables: an object with a key for each variable (if applicable)

`id`
`variables`
`template`
`html`
`text`
`react`
`from`
`subject`
`reply_to`
`template`
```text
variables: {
	CTA: 'Sign up now',
	CTA_LINK: 'https://example.com/signup'
}

```

Hide properties

`FIRST_NAME`
`LAST_NAME`
`EMAIL`
`UNSUBSCRIBE_URL`
- string: maximum length of 2,000 characters

- number: not greater than 2^53 - 1

`string`
`number`
## ​Headers

- Should be unique per API request

- Idempotency keys expire after 24 hours

- Have a maximum length of 256 characters

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.emails.send({
  from: 'Acme <[email protected]>',
  to: ['[email protected]'],
  subject: 'hello world',
  html: '<p>it works!</p>',
  replyTo: '[email protected]',
});

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/send-email/](https://resend.com/docs/api-reference/emails/send-email/)*

---

# Update Email

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const oneMinuteFromNow = new Date(Date.now() + 1000 * 60).toISOString();

const { data, error } = await resend.emails.update({
  id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
  scheduledAt: oneMinuteFromNow,
});

```

```json
{
  "object": "email",
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Update a scheduled email.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const oneMinuteFromNow = new Date(Date.now() + 1000 * 60).toISOString();

const { data, error } = await resend.emails.update({
  id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
  scheduledAt: oneMinuteFromNow,
});

```

```json
{
  "object": "email",
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

## ​Path Parameters

## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const oneMinuteFromNow = new Date(Date.now() + 1000 * 60).toISOString();

const { data, error } = await resend.emails.update({
  id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
  scheduledAt: oneMinuteFromNow,
});

```

```json
{
  "object": "email",
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/emails/update-email/](https://resend.com/docs/api-reference/emails/update-email/)*

---

# Errors

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

- Error schema

- invalid_idempotency_key

- validation_error

- missing_api_key

- restricted_api_key

- invalid_api_key

- validation_error

- validation_error

- not_found

- method_not_allowed

- invalid_idempotent_request

- concurrent_idempotent_requests

- invalid_attachment

- invalid_from_address

- invalid_access

- invalid_parameter

- invalid_region

- missing_required_field

- monthly_quota_exceeded

- daily_quota_exceeded

- rate_limit_exceeded

- security_error

- application_error

- internal_server_error

Troubleshoot problems with this comprehensive breakdown of all error codes.

## ​Error schema

### ​invalid_idempotency_key

`invalid_idempotency_key`
- Status: 400

- Message: The key must be between 1-256 chars.

- Suggested action: Retry with a valid idempotency key.

### ​validation_error

`validation_error`
- Status: 400

- Message: We found an error with one or more fields in the request.

- Suggested action: The message will contain more details about what field and error were found.

### ​missing_api_key

`missing_api_key`
- Status: 401

- Message: Missing API key in the authorization header.

- Suggested action: Include the following header in the request: Authorization: Bearer YOUR_API_KEY.

`Authorization: Bearer YOUR_API_KEY`
### ​restricted_api_key

`restricted_api_key`
- Status: 401

- Message: This API key is restricted to only send emails.

- Suggested action: Make sure the API key has Full access to perform actions other than sending emails.

`Full access`
### ​invalid_api_key

`invalid_api_key`
- Status: 403

- Message: API key is invalid.

- Suggested action: Make sure the API key is correct or generate a new API key in the dashboard.

### ​validation_error

`validation_error`
- Status: 403

- Message: You can only send testing emails to your own email address ([email protected]). To send emails to other recipients, please verify a domain at resend.com/domains, and change the from address to an email using this domain.

- Suggested action: In Resend’s Domain page, add and verify a domain for which you have DNS access. This allows you to send emails to addresses beyond your own. Learn more about resolving this error.

`[email protected]`
`from`
### ​validation_error

`validation_error`
- Status: 403

- Message: The domain.com domain is not verified. Please, add and verify your domain.

- Suggested action: Make sure the domain in your API request’s from field matches a domain you’ve verified in Resend. Update your API request to use your verified domain, or add and verify the domain you’re trying to use. Learn more about resolving this error.

`domain.com`
`from`
### ​not_found

`not_found`
- Status: 404

- Message: The requested endpoint does not exist.

- Suggested action: Change your request URL to match a valid API endpoint.

### ​method_not_allowed

`method_not_allowed`
- Status: 405

- Message: Method is not allowed for the requested path.

- Suggested action: Change your API endpoint to use a valid method.

### ​invalid_idempotent_request

`invalid_idempotent_request`
- Status: 409

- Message: Same idempotency key used with a different request payload.

- Suggested action: Change your idempotency key or payload.

### ​concurrent_idempotent_requests

`concurrent_idempotent_requests`
- Status: 409

- Message: Same idempotency key used while original request is still in progress.

- Suggested action: Try the request again later.

### ​invalid_attachment

`invalid_attachment`
- Status: 422

- Message: Attachment must have either a content or path.

- Suggested action: Attachments must either have a content (strings, Buffer, or Stream contents) or path to a remote resource (better for larger attachments).

`content`
`path`
`content`
`path`
### ​invalid_from_address

`invalid_from_address`
- Status: 422

- Message: Invalid from field.

- Suggested action: Make sure the from field is valid. The email address needs to follow the [email protected] or Name <[email protected]> format.

`from`
`from`
`[email protected]`
`Name <[email protected]>`
### ​invalid_access

`invalid_access`
- Status: 422

- Message: Access must be “full_access” | “sending_access”.

- Suggested action: Make sure the API key has necessary permissions.

### ​invalid_parameter

`invalid_parameter`
- Status: 422

- Message: The parameter must be a valid UUID.

- Suggested action: Check the value and make sure it’s valid.

`parameter`
### ​invalid_region

`invalid_region`
- Status: 422

- Message: Region must be “us-east-1” | “eu-west-1” | “sa-east-1”.

- Suggested action: Make sure the correct region is selected.

### ​missing_required_field

`missing_required_field`
- Status: 422

- Message: The request body is missing one or more required fields.

- Suggested action: Check the error message to see the list of missing fields.

### ​monthly_quota_exceeded

`monthly_quota_exceeded`
- Status: 429

- Message: You have reached your monthly email quota.

- Suggested action: Upgrade your plan to increase the monthly email quota. Both sent and received emails count towards this quota.

### ​daily_quota_exceeded

`daily_quota_exceeded`
- Status: 429

- Message: You have reached your daily email quota.

- Suggested action: Upgrade your plan to remove the daily quota limit or wait until 24 hours have passed. Both sent and received emails count towards this quota.

### ​rate_limit_exceeded

`rate_limit_exceeded`
- Status: 429

- Message: Too many requests. Please limit the number of requests per second. Or contact support to increase rate limit.

- Suggested action: You should read the response headers and reduce the rate at which you request the API. This can be done by introducing a queue mechanism or reducing the number of concurrent requests per second. If you have specific requirements, contact support to request a rate increase.

### ​security_error

`security_error`
- Status: 451

- Message: We may have found a security issue with the request.

- Suggested action: The message will contain more details. Contact support for more information.

### ​application_error

`application_error`
- Status: 500

- Message: An unexpected error occurred.

- Suggested action: Try the request again later. If the error does not resolve, check our status page for service updates.

### ​internal_server_error

`internal_server_error`
- Status: 500

- Message: An unexpected error occurred.

- Suggested action: Try the request again later. If the error does not resolve, check our status page for service updates.

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/errors/](https://resend.com/docs/api-reference/errors/)*

---

# Introduction

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

- Base URL

- Authentication

- Response codes

- Rate limit

- FAQ

Understand general concepts, response codes, and authentication strategies.

## ​Base URL

```text
https://api.resend.com

```

## ​Authentication

`Bearer re_xxxxxxxxx`
`re_xxxxxxxxx`
```text
Authorization: Bearer re_xxxxxxxxx

```

## ​Response codes

`2xx`
`4xx`
`5xx`
`200`
`400`
`401`
`403`
`404`
`429`
`5xx`
## ​Rate limit

`429`
## ​FAQ

How does pagination work with the API?

How do you handle API versioning?

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/introduction/](https://resend.com/docs/api-reference/introduction/)*

---

# Pagination

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

- Overview

- Currently-supported endpoints

- Parameters

- Response Format

- Strategies

- Forward Pagination

- Backward Pagination

- Best Practices

- Error Handling

Learn how pagination works in the Resend API.

## ​Overview

- object: always set to list.

- has_more: indicates whether there are more elements available.

- data: the list of returned items.

`object`
`list`
`has_more`
`data`
- limit: the number of items to return per page.

- after: the cursor to use to get the next page of results.

- before: the cursor to use to get the previous page of results.

`limit`
`after`
`before`
`id`
## ​Currently-supported endpoints

- List Domains

- List API Keys

- List Broadcasts

- List Segments

- List Contacts

- List Receiving Emails

- List Receiving Email Attachments

`limit`
`limit`
- List Emails

- List Templates

- List Topics

## ​Parameters

`20`
`100`
`1`
`after`
`before`
## ​Response Format

```text
{
  "object": "list",
  "has_more": true,
  "data": [
    /* Array of resources */
  ]
}

```

`list`
## ​Strategies

### ​Forward Pagination

`after`
```javascript
const resend = new Resend('re_xxxxxxxxx');

// First page
const { data: firstPage } = await resend.contacts.list({ limit: 50 });

// Second page (if has_more is true)
if (firstPage.has_more) {
  const lastId = firstPage.data[firstPage.data.length - 1].id;
  const { data: secondPage } = await resend.contacts.list({
    limit: 50,
    after: lastId,
  });
}

```

### ​Backward Pagination

`before`
```javascript
const resend = new Resend('re_xxxxxxxxx');

// Start from a specific point and go backward
const page = await resend.contacts.list({
  limit: 50,
  before: 'some-contact-id',
});

if (page.data.has_more) {
  const firstId = page.data.data[0].id;
  const previousPage = await resend.contacts.list({
    limit: 50,
    before: firstId,
  });
}

```

## ​Best Practices

Use appropriate page sizes

`limit`
Handle pagination gracefully

`has_more`
Consider rate limits

## ​Error Handling

`validation_error`
`validation_error`
`before`
`after`
```json
{
  "name": "validation_error",
  "statusCode": 422,
  "message": "The pagination limit must be a number between 1 and 100. See https://resend.com/docs/pagination for more information."
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/pagination/](https://resend.com/docs/api-reference/pagination/)*

---

# Usage Limits

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

- Rate Limits

- Response Headers

- Email Quotas

- Response Headers

- Contact Quotas

Learn about API rate limits, email sending quotas, and contact quotas.

## ​Rate Limits

### ​Response Headers

`ratelimit-limit`
`ratelimit-remaining`
`ratelimit-reset`
`retry-after`
`429`
## ​Email Quotas

### ​Response Headers

`x-resend-daily-quota`
`x-resend-monthly-quota`
`429`
- daily_quota_exceeded - You have reached your daily email quota. Upgrade your plan to remove the daily quota limit or wait until 24 hours have passed.

- monthly_quota_exceeded - You have reached your monthly email quota. Upgrade your plan to increase the monthly email quota.

`daily_quota_exceeded`
`monthly_quota_exceeded`
## ​Contact Quotas

`403`
`validation_error`
Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/rate-limit/](https://resend.com/docs/api-reference/rate-limit/)*

---

# Create Segment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.create({
  name: 'Registered Users',
});

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users"
}

```

Create a new segment for contacts to be added to.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.create({
  name: 'Registered Users',
});

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users"
}

```

## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.create({
  name: 'Registered Users',
});

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/segments/create-segment/](https://resend.com/docs/api-reference/segments/create-segment/)*

---

# Delete Segment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.remove(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

Remove an existing segment.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.remove(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.remove(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/segments/delete-segment/](https://resend.com/docs/api-reference/segments/delete-segment/)*

---

# Retrieve Segment

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.get(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users",
  "created_at": "2023-10-06T22:59:55.977Z"
}

```

Retrieve a single segment.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.get(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users",
  "created_at": "2023-10-06T22:59:55.977Z"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.get(
  '78261eea-8f8b-4381-83c6-79fa7120f1cf',
);

```

```json
{
  "object": "segment",
  "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
  "name": "Registered Users",
  "created_at": "2023-10-06T22:59:55.977Z"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/segments/get-segment/](https://resend.com/docs/api-reference/segments/get-segment/)*

---

# List Segments

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ]
}

```

Retrieve a list of segments.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ]
}

```

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.segments.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
      "name": "Registered Users",
      "created_at": "2023-10-06T22:59:55.977Z"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/segments/list-segments/](https://resend.com/docs/api-reference/segments/list-segments/)*

---

# Create Template

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.create({
  name: 'order-confirmation',
  html: '<p>Name: {{{PRODUCT}}}</p><p>Total: {{{PRICE}}}</p>',
  variables: [
    {
      key: 'PRODUCT',
      type: 'string',
      fallbackValue: 'item',
    },
    {
      key: 'PRICE',
      type: 'number',
      fallbackValue: 25,
    }
  ],
});

// Or create and publish a template in one step
await resend.templates.create({ ... }).publish();

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
  "object": "template"
}

```

Create a new template with optional variables.

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.create({
  name: 'order-confirmation',
  html: '<p>Name: {{{PRODUCT}}}</p><p>Total: {{{PRICE}}}</p>',
  variables: [
    {
      key: 'PRODUCT',
      type: 'string',
      fallbackValue: 'item',
    },
    {
      key: 'PRICE',
      type: 'number',
      fallbackValue: 25,
    }
  ],
});

// Or create and publish a template in one step
await resend.templates.create({ ... }).publish();

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
  "object": "template"
}

```

## ​Body Parameters

`"Your Name <[email protected]>"`
Hide properties

`PRODUCT_NAME`
`FIRST_NAME`
`LAST_NAME`
`EMAIL`
`RESEND_UNSUBSCRIBE_URL`
`contact`
`this`
`'string'`
`'number'`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.create({
  name: 'order-confirmation',
  html: '<p>Name: {{{PRODUCT}}}</p><p>Total: {{{PRICE}}}</p>',
  variables: [
    {
      key: 'PRODUCT',
      type: 'string',
      fallbackValue: 'item',
    },
    {
      key: 'PRICE',
      type: 'number',
      fallbackValue: 25,
    }
  ],
});

// Or create and publish a template in one step
await resend.templates.create({ ... }).publish();

```

```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
  "object": "template"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/create-template/](https://resend.com/docs/api-reference/templates/create-template/)*

---

# Delete Template

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.remove(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "deleted": true
}

```

Delete a template.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.remove(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "deleted": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.remove(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/delete-template/](https://resend.com/docs/api-reference/templates/delete-template/)*

---

# Duplicate Template

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.duplicate(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "e169aa45-1ecf-4183-9955-b1499d5701d3"
}

```

Duplicate a template.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.duplicate(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "e169aa45-1ecf-4183-9955-b1499d5701d3"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.duplicate(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "e169aa45-1ecf-4183-9955-b1499d5701d3"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/duplicate-template/](https://resend.com/docs/api-reference/templates/duplicate-template/)*

---

# Get Template

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.get(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "current_version_id": "b2693018-7abb-4b4b-b4cb-aadf72dc06bd",
  "alias": "reset-password",
  "name": "reset-password",
  "created_at": "2023-10-06T23:47:56.678Z",
  "updated_at": "2023-10-06T23:47:56.678Z",
  "status": "published",
  "published_at": "2023-10-06T23:47:56.678Z",
  "from": "John Doe <[email protected]>",
  "subject": "Hello, world!",
  "reply_to": null,
  "html": "<h1>Hello, world!</h1>",
  "text": "Hello, world!",
  "variables": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "key": "user_name",
      "type": "string",
      "fallback_value": "John Doe",
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z"
    }
  ],
  "has_unpublished_versions": true
}

```

Get a template by ID.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.get(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "current_version_id": "b2693018-7abb-4b4b-b4cb-aadf72dc06bd",
  "alias": "reset-password",
  "name": "reset-password",
  "created_at": "2023-10-06T23:47:56.678Z",
  "updated_at": "2023-10-06T23:47:56.678Z",
  "status": "published",
  "published_at": "2023-10-06T23:47:56.678Z",
  "from": "John Doe <[email protected]>",
  "subject": "Hello, world!",
  "reply_to": null,
  "html": "<h1>Hello, world!</h1>",
  "text": "Hello, world!",
  "variables": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "key": "user_name",
      "type": "string",
      "fallback_value": "John Doe",
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z"
    }
  ],
  "has_unpublished_versions": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.get(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "object": "template",
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "current_version_id": "b2693018-7abb-4b4b-b4cb-aadf72dc06bd",
  "alias": "reset-password",
  "name": "reset-password",
  "created_at": "2023-10-06T23:47:56.678Z",
  "updated_at": "2023-10-06T23:47:56.678Z",
  "status": "published",
  "published_at": "2023-10-06T23:47:56.678Z",
  "from": "John Doe <[email protected]>",
  "subject": "Hello, world!",
  "reply_to": null,
  "html": "<h1>Hello, world!</h1>",
  "text": "Hello, world!",
  "variables": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "key": "user_name",
      "type": "string",
      "fallback_value": "John Doe",
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z"
    }
  ],
  "has_unpublished_versions": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/get-template/](https://resend.com/docs/api-reference/templates/get-template/)*

---

# List Templates

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.list({
  limit: 2,
  after: '34a080c9-b17d-4187-ad80-5af20266e535',
});

```

```json
{
  "object": "list",
  "data": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "name": "reset-password",
      "status": "draft",
      "published_at": null,
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z",
      "alias": "reset-password"
    },
    {
      "id": "b7f9c2e1-1234-4abc-9def-567890abcdef",
      "name": "welcome-message",
      "status": "published",
      "published_at": "2023-10-06T23:47:56.678Z",
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z",
      "alias": "welcome-message"
    }
  ],
  "has_more": false
}

```

List all templates.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.list({
  limit: 2,
  after: '34a080c9-b17d-4187-ad80-5af20266e535',
});

```

```json
{
  "object": "list",
  "data": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "name": "reset-password",
      "status": "draft",
      "published_at": null,
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z",
      "alias": "reset-password"
    },
    {
      "id": "b7f9c2e1-1234-4abc-9def-567890abcdef",
      "name": "welcome-message",
      "status": "published",
      "published_at": "2023-10-06T23:47:56.678Z",
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z",
      "alias": "welcome-message"
    }
  ],
  "has_more": false
}

```

`limit`
`after`
`before`
## Query Parameters

- Default value: 20

- Maximum value: 100

- Minimum value: 1

`20`
`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.list({
  limit: 2,
  after: '34a080c9-b17d-4187-ad80-5af20266e535',
});

```

```json
{
  "object": "list",
  "data": [
    {
      "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
      "name": "reset-password",
      "status": "draft",
      "published_at": null,
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z",
      "alias": "reset-password"
    },
    {
      "id": "b7f9c2e1-1234-4abc-9def-567890abcdef",
      "name": "welcome-message",
      "status": "published",
      "published_at": "2023-10-06T23:47:56.678Z",
      "created_at": "2023-10-06T23:47:56.678Z",
      "updated_at": "2023-10-06T23:47:56.678Z",
      "alias": "welcome-message"
    }
  ],
  "has_more": false
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/list-templates/](https://resend.com/docs/api-reference/templates/list-templates/)*

---

# Publish Template

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.publish(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "object": "template"
}

```

Publish a template.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.publish(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "object": "template"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.publish(
  '34a080c9-b17d-4187-ad80-5af20266e535',
);

```

```json
{
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "object": "template"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/publish-template/](https://resend.com/docs/api-reference/templates/publish-template/)*

---

# Update Template

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.update(
  '34a080c9-b17d-4187-ad80-5af20266e535',
  {
    name: 'order-confirmation',
    html: '<p>Total: {{{PRICE}}}</p><p>Name: {{{PRODUCT}}}</p>',
  },
);

```

```json
{
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "object": "template"
}

```

Update a template.

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.update(
  '34a080c9-b17d-4187-ad80-5af20266e535',
  {
    name: 'order-confirmation',
    html: '<p>Total: {{{PRICE}}}</p><p>Name: {{{PRODUCT}}}</p>',
  },
);

```

```json
{
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "object": "template"
}

```

## ​Path Parameters

## ​Body Parameters

`"Your Name <[email protected]>"`
Hide properties

`PRODUCT_NAME`
`FIRST_NAME`
`LAST_NAME`
`EMAIL`
`RESEND_UNSUBSCRIBE_URL`
`contact`
`this`
`'string'`
`'number'`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.templates.update(
  '34a080c9-b17d-4187-ad80-5af20266e535',
  {
    name: 'order-confirmation',
    html: '<p>Total: {{{PRICE}}}</p><p>Name: {{{PRODUCT}}}</p>',
  },
);

```

```json
{
  "id": "34a080c9-b17d-4187-ad80-5af20266e535",
  "object": "template"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/templates/update-template/](https://resend.com/docs/api-reference/templates/update-template/)*

---

# Create Topic

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.create({
  name: 'Weekly Newsletter',
  defaultSubscription: 'opt_in',
});

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Create and email topics to segment your audience.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.create({
  name: 'Weekly Newsletter',
  defaultSubscription: 'opt_in',
});

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

## ​Body Parameters

`50`
`200`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.create({
  name: 'Weekly Newsletter',
  defaultSubscription: 'opt_in',
});

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/topics/create-topic/](https://resend.com/docs/api-reference/topics/create-topic/)*

---

# Delete Topic

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "deleted": true
}

```

Remove an existing topic.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "deleted": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.remove(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/topics/delete-topic/](https://resend.com/docs/api-reference/topics/delete-topic/)*

---

# Retrieve Topic

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.get(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "name": "Weekly Newsletter",
  "description": "Weekly newsletter for our subscribers",
  "default_subscription": "opt_in",
  "visibility": "public",
  "created_at": "2023-04-08T00:11:13.110779+00:00"
}

```

Retrieve a topic by its ID.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.get(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "name": "Weekly Newsletter",
  "description": "Weekly newsletter for our subscribers",
  "default_subscription": "opt_in",
  "visibility": "public",
  "created_at": "2023-04-08T00:11:13.110779+00:00"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.get(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
  "name": "Weekly Newsletter",
  "description": "Weekly newsletter for our subscribers",
  "default_subscription": "opt_in",
  "visibility": "public",
  "created_at": "2023-04-08T00:11:13.110779+00:00"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/topics/get-topic/](https://resend.com/docs/api-reference/topics/get-topic/)*

---

# List Topics

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "name": "Weekly Newsletter",
      "description": "Weekly newsletter for our subscribers",
      "default_subscription": "opt_in",
      "visibility": "public",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

Retrieve a list of topics for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "name": "Weekly Newsletter",
      "description": "Weekly newsletter for our subscribers",
      "default_subscription": "opt_in",
      "visibility": "public",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

## Query Parameters

- Default value: 20

- Maximum value: 100

- Minimum value: 1

`20`
`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e",
      "name": "Weekly Newsletter",
      "description": "Weekly newsletter for our subscribers",
      "default_subscription": "opt_in",
      "visibility": "public",
      "created_at": "2023-04-08T00:11:13.110779+00:00"
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/topics/list-topics/](https://resend.com/docs/api-reference/topics/list-topics/)*

---

# Update Topic

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.update(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
  {
    name: 'Weekly Newsletter',
    description: 'Weekly newsletter for our subscribers',
  },
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Update an existing topic.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.update(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
  {
    name: 'Weekly Newsletter',
    description: 'Weekly newsletter for our subscribers',
  },
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

## ​Path Parameters

## ​Body Parameters

`50`
`200`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.topics.update(
  'b6d24b8e-af0b-4c3c-be0c-359bbd97381e',
  {
    name: 'Weekly Newsletter',
    description: 'Weekly newsletter for our subscribers',
  },
);

```

```json
{
  "object": "topic",
  "id": "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/topics/update-topic/](https://resend.com/docs/api-reference/topics/update-topic/)*

---

# Create Webhook

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.create({
  endpoint: 'https://example.com/handler',
  events: ['email.sent'],
});

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "signing_secret": "whsec_xxxxxxxxxx"
}

```

Create a webhook to receive real-time notifications about email events.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.create({
  endpoint: 'https://example.com/handler',
  events: ['email.sent'],
});

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "signing_secret": "whsec_xxxxxxxxxx"
}

```

## ​Body Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.create({
  endpoint: 'https://example.com/handler',
  events: ['email.sent'],
});

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "signing_secret": "whsec_xxxxxxxxxx"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/webhooks/create-webhook/](https://resend.com/docs/api-reference/webhooks/create-webhook/)*

---

# Delete Webhook

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.remove(
  '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
);

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "deleted": true
}

```

Remove an existing webhook.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.remove(
  '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
);

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "deleted": true
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.remove(
  '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
);

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "deleted": true
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/webhooks/delete-webhook/](https://resend.com/docs/api-reference/webhooks/delete-webhook/)*

---

# Retrieve Webhook

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.get(
  '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
);

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "created_at": "2023-08-22T15:28:00.000Z",
  "status": "enabled",
  "endpoint": "https://example.com/handler",
  "events": ["email.sent"],
  "signing_secret": "whsec_xxxxxxxxxx"
}

```

Retrieve a single webhook for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.get(
  '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
);

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "created_at": "2023-08-22T15:28:00.000Z",
  "status": "enabled",
  "endpoint": "https://example.com/handler",
  "events": ["email.sent"],
  "signing_secret": "whsec_xxxxxxxxxx"
}

```

## ​Path Parameters

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.get(
  '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
);

```

```json
{
  "object": "webhook",
  "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
  "created_at": "2023-08-22T15:28:00.000Z",
  "status": "enabled",
  "endpoint": "https://example.com/handler",
  "events": ["email.sent"],
  "signing_secret": "whsec_xxxxxxxxxx"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/webhooks/get-webhook/](https://resend.com/docs/api-reference/webhooks/get-webhook/)*

---

# List Webhooks

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "7ab123cd-ef45-6789-abcd-ef0123456789",
      "created_at": "2023-09-10T10:15:30.000Z",
      "status": "disabled",
      "endpoint": "https://first-webhook.example.com/handler",
      "events": ["email.sent"]
    },
    {
      "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
      "created_at": "2023-08-22T15:28:00.000Z",
      "status": "enabled",
      "endpoint": "https://second-webhook.example.com/receive",
      "events": ["email.received"]
    }
  ]
}

```

Retrieve a list of webhooks for the authenticated user.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "7ab123cd-ef45-6789-abcd-ef0123456789",
      "created_at": "2023-09-10T10:15:30.000Z",
      "status": "disabled",
      "endpoint": "https://first-webhook.example.com/handler",
      "events": ["email.sent"]
    },
    {
      "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
      "created_at": "2023-08-22T15:28:00.000Z",
      "status": "enabled",
      "endpoint": "https://second-webhook.example.com/receive",
      "events": ["email.received"]
    }
  ]
}

```

## Query Parameters

`limit`
`limit`
- Maximum value: 100

- Minimum value: 1

`100`
`1`
`before`
`after`
`after`
`before`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.list();

```

```json
{
  "object": "list",
  "has_more": false,
  "data": [
    {
      "id": "7ab123cd-ef45-6789-abcd-ef0123456789",
      "created_at": "2023-09-10T10:15:30.000Z",
      "status": "disabled",
      "endpoint": "https://first-webhook.example.com/handler",
      "events": ["email.sent"]
    },
    {
      "id": "4dd369bc-aa82-4ff3-97de-514ae3000ee0",
      "created_at": "2023-08-22T15:28:00.000Z",
      "status": "enabled",
      "endpoint": "https://second-webhook.example.com/receive",
      "events": ["email.received"]
    }
  ]
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/webhooks/list-webhooks/](https://resend.com/docs/api-reference/webhooks/list-webhooks/)*

---

# Update Webhook

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### API Reference

- Introduction

- Pagination

- Usage Limits

- Errors

##### Sending

- POSTSend Email

- POSTSend Batch Emails

- GETRetrieve Email

- GETList Sent Emails

- PATCHUpdate Email

- POSTCancel Email

- GETRetrieve Attachment

- GETList Attachments

##### Receiving

- GETRetrieve Received Email

- GETList Received Emails

- GETRetrieve Attachment

- GETList Attachments

##### Domains

- POSTCreate Domain

- POSTVerify Domain

- GETRetrieve Domain

- GETList Domains

- PATCHUpdate Domain

- DELDelete Domain

##### API Keys

- POSTCreate API key

- GETList API keys

- DELDelete API key

##### Broadcasts

- POSTCreate Broadcast

- POSTSend Broadcast

- GETRetrieve Broadcast

- GETList Broadcasts

- PATCHUpdate Broadcast

- DELDelete Broadcast

##### Contacts

- POSTCreate Contact

- GETRetrieve Contact

- GETList Contacts

- PATCHUpdate Contact

- DELDelete Contact

- POSTAdd Contact to Segment

- GETList Contact Segments

- DELDelete Contact Segment

- GETRetrieve Contact Topics

- PATCHUpdate Contact Topics

##### Contact Properties

- POSTCreate Contact Property

- GETRetrieve Contact Property

- GETList Contact Properties

- PATCHUpdate Contact Property

- DELDelete Contact Property

##### Segments

- POSTCreate Segment

- GETRetrieve Segment

- GETList Segments

- DELDelete Segment

##### Audiences

- POSTCreate Audience

- GETRetrieve Audience

- GETList Audiences

- DELDelete Audience

##### Topics

- POSTCreate Topic

- GETRetrieve Topic

- GETList Topics

- PATCHUpdate Topic

- DELDelete Topic

##### Templates

- POSTCreate Template

- GETGet Template

- GETList Templates

- PATCHUpdate Template

- DELDelete Template

- POSTPublish Template

- POSTDuplicate Template

##### Webhooks

- POSTCreate Webhook

- GETRetrieve Webhook

- GETList Webhooks

- PATCHUpdate Webhook

- DELDelete Webhook

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.update(
  '430eed87-632a-4ea6-90db-0aace67ec228',
  {
    endpoint: 'https://new-webhook.example.com/handler',
    events: ['email.sent', 'email.delivered'],
    status: 'enabled',
  },
);

```

```json
{
  "object": "webhook",
  "id": "430eed87-632a-4ea6-90db-0aace67ec228"
}

```

Update an existing webhook configuration.

```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.update(
  '430eed87-632a-4ea6-90db-0aace67ec228',
  {
    endpoint: 'https://new-webhook.example.com/handler',
    events: ['email.sent', 'email.delivered'],
    status: 'enabled',
  },
);

```

```json
{
  "object": "webhook",
  "id": "430eed87-632a-4ea6-90db-0aace67ec228"
}

```

## ​Path Parameters

## ​Body Parameters

`enabled`
`disabled`
```javascript
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.webhooks.update(
  '430eed87-632a-4ea6-90db-0aace67ec228',
  {
    endpoint: 'https://new-webhook.example.com/handler',
    events: ['email.sent', 'email.delivered'],
    status: 'enabled',
  },
);

```

```json
{
  "object": "webhook",
  "id": "430eed87-632a-4ea6-90db-0aace67ec228"
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/api-reference/webhooks/update-webhook/](https://resend.com/docs/api-reference/webhooks/update-webhook/)*

---

# Idempotency Keys

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- SendingIntroductionBatch SendingAttachmentsEmbed ImagesSchedule EmailSend Test EmailsCustom HeadersIdempotency KeysEmail BouncesEmail SuppressionsDeliverability InsightsUnsubscribe LinkTags

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

- Introduction

- Batch Sending

- Attachments

- Embed Images

- Schedule Email

- Send Test Emails

- Custom Headers

- Idempotency Keys

- Email Bounces

- Email Suppressions

- Deliverability Insights

- Unsubscribe Link

- Tags

##### Resources

- Examples

- SDKs

- Security

- Integrations

- How does it work?

- How to use idempotency keys?

- POST /emails endpoint example

- POST /emails/batch endpoint example

- Possible responses

Use idempotency keys to ensure that emails are sent only once.

`POST /emails`
`POST     /emails/batch`
## ​How does it work?

## ​How to use idempotency keys?

`<event-type>/<entity-id>`
`welcome-user/123456789`
`Idempotency-Key`
`Resend-Idempotency-Key`
### ​POST /emails endpoint example

`POST /emails`
```text
await resend.emails.send(
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'hello world',
    html: '<p>it works!</p>',
  },
  {
    idempotencyKey: 'welcome-user/123456789',
  },
);

```

### ​POST /emails/batch endpoint example

`POST /emails/batch`
`<event-type>/<entity-id>`
`team-quota/123456789`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.batch.send(
  [
    {
      from: 'Acme <[email protected]>',
      to: ['[email protected]'],
      subject: 'hello world',
      html: '<h1>it works!</h1>',
    },
    {
      from: 'Acme <[email protected]>',
      to: ['[email protected]'],
      subject: 'world hello',
      html: '<p>it works!</p>',
    },
  ],
  {
    idempotencyKey: 'team-quota/123456789',
  },
);

```

## ​Possible responses

- Successful responses will return the email ID of the sent email.

- Error responses will return one of the following errors:

400: invalid_idempotency_key - the idempotency key has to be between 1-256 characters. You can retry with a valid key or without supplying an idempotency key.
409: invalid_idempotent_request - this idempotency key has already been used on a request that had a different payload. Retrying this request is useless without changing the idempotency key or payload.
409: concurrent_idempotent_requests - another request with the same idempotency key is currently in progress. As it isn’t finished yet, Resend can’t return its original response, but it is safe to retry this request later if needed.

- 400: invalid_idempotency_key - the idempotency key has to be between 1-256 characters. You can retry with a valid key or without supplying an idempotency key.

- 409: invalid_idempotent_request - this idempotency key has already been used on a request that had a different payload. Retrying this request is useless without changing the idempotency key or payload.

- 409: concurrent_idempotent_requests - another request with the same idempotency key is currently in progress. As it isn’t finished yet, Resend can’t return its original response, but it is safe to retry this request later if needed.

`400`
`invalid_idempotency_key`
`409`
`invalid_idempotent_request`
`409`
`concurrent_idempotent_requests`
Was this page helpful?

*Fonte: [https://resend.com/docs/dashboard/emails/idempotency-keys/](https://resend.com/docs/dashboard/emails/idempotency-keys/)*

---

# Managing Tags

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- SendingIntroductionBatch SendingAttachmentsEmbed ImagesSchedule EmailSend Test EmailsCustom HeadersIdempotency KeysEmail BouncesEmail SuppressionsDeliverability InsightsUnsubscribe LinkTags

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

- Introduction

- Batch Sending

- Attachments

- Embed Images

- Schedule Email

- Send Test Emails

- Custom Headers

- Idempotency Keys

- Email Bounces

- Email Suppressions

- Deliverability Insights

- Unsubscribe Link

- Tags

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Add tags on the POST /emails endpoint

- Add tags on the POST /emails/batch endpoint

Add unique identifiers to emails sent.

- Associate the email a “customer ID” from your application

- Add a label from your database like “free” or “enterprise”

- Note the category of email sent, like “welcome” or “password reset”

## ​Add tags on the POST /emails endpoint

`POST /emails`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.emails.send({
  from: 'Acme <[email protected]>',
  to: ['[email protected]'],
  subject: 'hello world',
  html: '<p>it works!</p>',
  tags: [
    {
      name: 'category',
      value: 'confirm_email',
    },
  ],
});

```

## ​Add tags on the POST /emails/batch endpoint

`POST /emails/batch`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

const { data, error } = await resend.batch.send([
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'hello world',
    html: '<h1>it works!</h1>',
    tags: [
      {
        name: 'category',
        value: 'confirm_email',
      },
    ],
  },
  {
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'world hello',
    html: '<p>it works!</p>',
    tags: [
      {
        name: 'category',
        value: 'confirm_email',
      },
    ],
  },
]);

```

Was this page helpful?

*Fonte: [https://resend.com/docs/dashboard/emails/tags/](https://resend.com/docs/dashboard/emails/tags/)*

---

# Migrating from Audiences to Segments

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- AudienceIntroductionContactsPropertiesSegmentsTopicsMigration GuideSubscriptions

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

- Introduction

- Contacts

- Properties

- Segments

- Topics

- Migration Guide

- Subscriptions

##### Resources

- Examples

- SDKs

- Security

- Integrations

- What’s changing?

- Unsubscribing

- What you should do

- How can we help?

Learn how to migrate from Audiences to Segments

`audience_id`
## ​What’s changing?

- Before: If a Contact with the same email appeared in multiple Segments, it was counted as multiple Contacts.

- Now: Each email address is treated as a single Contact across your team, even if it appears in multiple Segments.

- Contact: a global entity linked to a specific email address.

- Segment: an internal segmentation tool for your team to organize sending.

- Topic: a user-facing tool for managing email preferences.

## ​Unsubscribing

- Unsubscribe from certain Topics (email’s preference).

- Or unsubscribe from everything you send (update contact status).

## ​What you should do

- Create a Topic for each type of email you send.

- Assign the right users to each Topic.

- Use Segments purely for your internal organization.

- Contacts

- Topics

- Segments

## ​How can we help?

Was this page helpful?

*Fonte: [https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments/](https://resend.com/docs/dashboard/segments/migrating-from-audiences-to-segments/)*

---

# Using Templates

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- TemplatesIntroductionVersion HistoryTemplate Variables

- Settings

- Introduction

- Version History

- Template Variables

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Add a Template

- Add a Template in the dashboard

- Add a Template from an existing email

- Create a Template by using the API

- Add Variables

- Send Test Emails

- Publish a Template

- Send Emails with Templates

- Duplicate a Template

- Delete a Template

- Validation errors

Learn how to use templates to send emails.

`id`
`variables`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.emails.send({
  from: 'Acme <[email protected]>',
  to: '[email protected]',
  template: {
    id: 'order-confirmation',
    variables: {
      PRODUCT: 'Vintage Macintosh',
      PRICE: 499,
    },
  },
});

```

- Login/Auth

- Onboarding

- Ecommerce

- Notifications

- Automations

## ​Add a Template

- In the dashboard

- From an existing email

- Using the API

### ​Add a Template in the dashboard

### ​Add a Template from an existing email

### ​Create a Template by using the API

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.templates.create({
  name: 'order-confirmation',
  from: 'Resend Store <[email protected]>',
  subject: 'Thanks for your order!',
  html: '<p>Name: {{{PRODUCT}}}</p><p>Total: {{{PRICE}}}</p>',
  variables: [
    {
      key: 'PRODUCT',
      type: 'string',
      fallbackValue: 'item',
    },
    {
      key: 'PRICE',
      type: 'number',
      fallbackValue: 20,
    },
  ],
});

```

## ​Add Variables

`{{`
`name`
`type`
`fallback_value`
`FIRST_NAME`
`LAST_NAME`
`EMAIL`
`RESEND_UNSUBSCRIBE_URL`
`contact`
`this`
## ​Send Test Emails

## ​Publish a Template

```text
await resend.templates.create({ ... }).publish();

```

## ​Send Emails with Templates

```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

await resend.emails.send({
  from: 'Acme <[email protected]>',
  to: '[email protected]',
  template: {
    id: 'order-confirmation',
    variables: {
      PRODUCT: 'Vintage Macintosh',
      PRICE: 499,
    },
  },
});

```

## ​Duplicate a Template

You can create a Template from an existing Broadcast. Locate your desired
Broadcast in the Broadcast dashboard, click
the more options button, and choose Clone as template.

## ​Delete a Template

## ​Validation errors

Was this page helpful?

*Fonte: [https://resend.com/docs/dashboard/templates/introduction/](https://resend.com/docs/dashboard/templates/introduction/)*

---

# Examples

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

Explore sample apps for different use cases.

## Attachments

## NextAuth

## React Email

## Webhooks

## Prevent thread on Gmail

## Unsubscribe url header

Was this page helpful?

*Fonte: [https://resend.com/docs/examples/](https://resend.com/docs/examples/)*

---

# Integrations

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- AI

- No-code

- Notifications

- Content Management Systems

- Developer tools

- Build your own integration

Integrate Resend with the tools you already use.

## ​AI

## Lovable

## Anything

## Wildcard

## mcp.run

## Rocket

## Base44

## Leap.new

## Pica

## ​No-code

## Zapier

## Pipedream

## Activepieces

## Monkedo

## Make.com

## Lindy

## BuildShip

## viaSocket

## Stacksync

## Post SMTP

## ​Notifications

## Courier

## Novu

## Knock

## Engagespot

## Dittofeed

## Suprsend

## ​Content Management Systems

## Payload CMS

## Strapi CMS

## ​Developer tools

## Convex

## Inngest

## Upstash

## Trigger.dev

## Infisical

## Fastgen

## Medusa

## OpenMeter

## Invopop

## Tinybird

## Coolify

## Courrier

## Kinde

## ​Build your own integration

- Read the documentation on how to send emails.

- Integrate with your product offering.

- Reach out to us to feature your product on this page.

Was this page helpful?

*Fonte: [https://resend.com/docs/integrations/](https://resend.com/docs/integrations/)*

---

# Introduction

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Quickstart

- Explore

Resend is the email API for developers.

## ​Quickstart

## Node.js Quickstart

## Next.js Quickstart

## Express Quickstart

## PHP Quickstart

## Laravel Quickstart

## Python Quickstart

## Ruby Quickstart

## Rails Quickstart

## Go Quickstart

## Rust Quickstart

## Elixir Quickstart

## Java Quickstart

## .NET Quickstart

## ​Explore

## Emails

## Domains

## Webhooks

Was this page helpful?

*Fonte: [https://resend.com/docs/introduction/](https://resend.com/docs/introduction/)*

---

# Page Not Found

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

*Fonte: [https://resend.com/docs/introduction/dashboard/domains/introduction/](https://resend.com/docs/introduction/dashboard/domains/introduction/)*

---

# Page Not Found

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

*Fonte: [https://resend.com/docs/introduction/dashboard/emails/](https://resend.com/docs/introduction/dashboard/emails/)*

---

# Page Not Found

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

*Fonte: [https://resend.com/docs/introduction/send-with-express/](https://resend.com/docs/introduction/send-with-express/)*

---

# Page Not Found

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

*Fonte: [https://resend.com/docs/introduction/send-with-laravel/](https://resend.com/docs/introduction/send-with-laravel/)*

---

# Introduction

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

##### Domains Verification

- Avoid MX Conflicts

- Domain Not Verifying

##### DNS Guides

- Cloudflare

- Gandi

- GoDaddy

- Hetzner

- Hostinger

- IONOS

- Namecheap

- Porkbun

- AWS Route 53

- Squarespace

- Strato

- Vercel

##### Tutorials

- Supabase Resend Quickstart

- Supabase Go-Live Checklist

- Set up your logo on Apple Mail

- Send with an Avatar

- Inbound: Forward Emails

##### Testing

- E2E testing with Playwright

- Email addresses for testing

##### Troubleshooting

- Domain Mismatch

- resend.dev Domain Error

- Avoid Gmail's Spam Folder

- Avoid Outlook's Spam Folder

- CORS Issues

##### Deliverability

- Managing the Suppression List

- Receiving Emails

- Subdomain vs Root Domain

- Delivered Email Not Arriving

- Sending to Apple Private Email Relay

- Open Rates Not Accurate

- Audience Hygiene

- Warm-up Guide

- What is email consent?

##### Sending

- Account Quotas And Limits

- What sending feature to use?

- When to Add an Unsubscribe Link

- How do Dedicated IPs work?

- Creating email address

- Turn Off Message Storage

- Unsupported Attachment Types

##### AI Tools

- MCP Server

- Anything Resend Integration

- Lovable Resend Integration

- v0 Resend Integration

- Bolt.new Resend Integration

- Replit Resend Integration

- Base44 Resend Integration

- Leap Resend Integration

##### Account Management

- Delete your Resend Account

- Production Approval

- Resend Pricing

- Configuring TLS

- Handling API Keys

A collection of answers to frequently asked questions.

## Can I receive emails with Resend?

## How do Dedicated IPs Work?

## How do I avoid conflicts with my MX records?

## How do I avoid Gmail's spam folder?

## How do I avoid Outlook's spam folder?

## How do I ensure sensitive data isn't stored on Resend?

## How do I fix CORS issues?

## How do I maximize deliverability for Supabase Auth emails?

## How do I send with an avatar?

## Is it better to send emails from a subdomain or the root domain?

## What if an email says delivered but the recipient hasn't received it?

## What if my domain is not verifying?

## What is Resend Pricing?

## Why are my open rates not accurate?

## How can I delete my Resend account?

## Should I add an unsubscribe link to all of my emails sent with Resend?

## Why are my emails landing on the suppression list?

Was this page helpful?

*Fonte: [https://resend.com/docs/knowledge-base/introduction/](https://resend.com/docs/knowledge-base/introduction/)*

---

# Official SDKs

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Official SDKs

- Community SDKs

- OpenAPI

Open source client libraries for your favorite platforms.

## ​Official SDKs

## Node.js

## PHP

## Laravel

## Python

## Ruby

## Go

## Java

## Rust

## .NET

## ​Community SDKs

## Elixir

## NestJS

## Dart

## ​OpenAPI

## OpenAPI

Was this page helpful?

*Fonte: [https://resend.com/docs/sdks/](https://resend.com/docs/sdks/)*

---

# Security

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Governance

- Compliance Standards

- Data Protection

- Product Security

- Penetration testing

- Vulnerability scanning

- Enterprise Security

- Responsible Disclosure

An overview of Resend security features and practices.

## ​Governance

## Least Privilege

## Consistency

## Defense in Depth

## Continuous Improvement

### ​Compliance Standards

SOC 2 Type II

GDPR

## ​Data Protection

## Data at rest

## Data in transit

## Data backup

## ​Product Security

### ​Penetration testing

### ​Vulnerability scanning

- Critical: 15 Days

- High: 30 Days

- Medium: 90 Day

- Low: 180 Days

- Informational: As needed

## ​Enterprise Security

## Endpoint protection

## Security education

## Identity and access management

## ​Responsible Disclosure

Was this page helpful?

*Fonte: [https://resend.com/docs/security/](https://resend.com/docs/security/)*

---

# Send emails with .NET

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NETIntroduction

- SMTP

- Introduction

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send emails using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend .NET SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```text
dotnet add package Resend

```

## ​2. Send emails using HTML

```tsx
using Resend;

builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>( o =>
{
    o.ApiToken = Environment.GetEnvironmentVariable( "RESEND_APITOKEN" )!;
} );
builder.Services.AddTransient<IResend, ResendClient>();

```

`IResend`
```tsx
using Resend;

public class FeatureImplementation
{
    private readonly IResend _resend;


    public FeatureImplementation( IResend resend )
    {
        _resend = resend;
    }


    public Task Execute()
    {
        var message = new EmailMessage();
        message.From = "Acme <[email protected]>";
        message.To.Add( "[email protected]" );
        message.Subject = "hello world";
        message.HtmlBody = "<strong>it works!</strong>";

        await _resend.EmailSendAsync( message );
    }
}

```

## ​3. Try it yourself

## ASP.NET Controller API

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-dotnet/](https://resend.com/docs/send-with-dotnet/)*

---

# Send emails with Elixir

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- ElixirIntroductionPhoenix

- Java

- .NET

- SMTP

- Introduction

- Phoenix

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send email using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend Elixir SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

`resend`
`mix.exs`
```python
def deps do
  [
    {:resend, "~> 0.4.0"}
  ]
end

```

## ​2. Send email using HTML

`html`
```text
client = Resend.client(api_key: System.get_env("RESEND_API_KEY"))

Resend.Emails.send(client, %{
  from: "Acme <[email protected]>",
  to: ["[email protected]"],
  subject: "hello world",
  html: "<strong>it works!</strong>"
})

```

## ​3. Try it yourself

## Elixir Example

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-elixir/](https://resend.com/docs/send-with-elixir/)*

---

# Send emails with Go

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- GoIntroduction

- Rust

- Elixir

- Java

- .NET

- SMTP

- Introduction

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send email using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend Go SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```text
go get github.com/resend/resend-go/v3

```

## ​2. Send email using HTML

`html`
```tsx
package main

import "github.com/resend/resend-go/v3"

func main() {
    apiKey := "re_xxxxxxxxx"

    client := resend.NewClient(apiKey)

    params := &resend.SendEmailRequest{
        From:    "Acme <[email protected]>",
        To:      []string{"[email protected]"},
        Html:    "<strong>hello world</strong>",
        Subject: "Hello from Golang",
        Cc:      []string{"[email protected]"},
        Bcc:     []string{"[email protected]"},
        ReplyTo: "[email protected]",
    }

    sent, err := client.Emails.Send(params)
    if err != nil {
        fmt.Println(err.Error())
        return
    }
    fmt.Println(sent.Id)
}

```

## ​3. Try it yourself

## Golang Examples

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-go/](https://resend.com/docs/send-with-go/)*

---

# Send emails with Java

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- JavaIntroduction

- .NET

- SMTP

- Introduction

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send emails using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend Java SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```text
implementation 'com.resend:resend-java:+'

```

## ​2. Send emails using HTML

```tsx
import com.resend.*;

public class Main {
    public static void main(String[] args) {
        Resend resend = new Resend("re_xxxxxxxxx");

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Acme <[email protected]>")
                .to("[email protected]")
                .subject("it works!")
                .html("<strong>hello world</strong>")
                .build();

         try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println(data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
        }
    }
}

```

## ​3. Try it yourself

## Java Examples

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-java/](https://resend.com/docs/send-with-java/)*

---

# Send emails with Next.js

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.jsIntroductionNext.jsRemixNuxtSvelteKitExpressRedwoodJSHonoBunAstroRailway

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

- Introduction

- Next.js

- Remix

- Nuxt

- SvelteKit

- Express

- RedwoodJS

- Hono

- Bun

- Astro

- Railway

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Create an email template

- 3. Send email using React

- 4. Try it yourself

Learn how to send your first email using Next.js and the Resend Node.js SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```bash
npm install resend

```

## ​2. Create an email template

`components/email-template.tsx`
```tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}

```

## ​3. Send email using React

`app/api/send/route.ts`
`pages/api/send.ts`
`react`
```tsx
import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <[email protected]>',
      to: ['[email protected]'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

```

## ​4. Try it yourself

## Next.js Example (App Router)

## Next.js Example (Pages Router)

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-nextjs/](https://resend.com/docs/send-with-nextjs/)*

---

# Send emails with Node.js

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.jsIntroductionNext.jsRemixNuxtSvelteKitExpressRedwoodJSHonoBunAstroRailway

- Serverless

- PHP

- Ruby

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

- Introduction

- Next.js

- Remix

- Nuxt

- SvelteKit

- Express

- RedwoodJS

- Hono

- Bun

- Astro

- Railway

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send email using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend Node.js SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```bash
npm install resend

```

## ​2. Send email using HTML

`html`
```tsx
import { Resend } from 'resend';

const resend = new Resend('re_xxxxxxxxx');

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <[email protected]>',
    to: ['[email protected]'],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();

```

## ​3. Try it yourself

## Node.js Example

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-nodejs/](https://resend.com/docs/send-with-nodejs/)*

---

# Send emails with Python

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- PythonIntroductionFlaskFastAPIDjango

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

- Introduction

- Flask

- FastAPI

- Django

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send email using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend Python SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```bash
pip install resend

```

## ​2. Send email using HTML

`html`
```tsx
import os
import resend

resend.api_key = os.environ["RESEND_API_KEY"]

params: resend.Emails.SendParams = {
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "subject": "hello world",
    "html": "<strong>it works!</strong>",
}

email = resend.Emails.send(params)
print(email)

```

## ​3. Try it yourself

## Python Example

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-python/](https://resend.com/docs/send-with-python/)*

---

# Send emails with Rails

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- RubyIntroductionRailsSinatra

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

- Introduction

- Rails

- Sinatra

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send email using Rails Action Mailer

- 3. Try it yourself

Learn how to send your first email using Rails and the Resend Ruby SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```text
gem install resend

```

## ​2. Send email using Rails Action Mailer

```text
Resend.api_key = "re_xxxxxxxxx"

```

```text
config.action_mailer.delivery_method = :resend

```

`UserMailer`
```python
class UserMailer < ApplicationMailer
  default from: 'Acme <[email protected]>' # this domain must be verified with Resend
  def welcome_email
    @user = params[:user]
    @url = 'http://example.com/login'
    mail(to: ["[email protected]"], subject: 'hello world')
  end
end

```

```html
<!doctype html>
<html>
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>
  <body>
    <h1>Welcome to example.com, <%= @user.name %></h1>
    <p>You have successfully signed up to example.com,</p>
    <p>To log in to the site, just follow this link: <%= @url %>.</p>
    <p>Thanks for joining and have a great day!</p>
  </body>
</html>

```

`UserMailer`
`UserMailer`
```tsx
u = User.new name: "derich"
mailer = UserMailer.with(user: u).welcome_email

# => #<Mail::Message:153700, Multipart: false, Headers: <From: [email protected]>, <To: [email protected]>, <Subject: hello world>, <Mime-Version: 1.0>...

```

`deliver_now!`
```javascript
mailer.deliver_now!

# => {:id=>"a193c81e-9ac5-4708-a569-5caf14220539", :from=>....}

```

## ​3. Try it yourself

## Rails Example

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-rails/](https://resend.com/docs/send-with-rails/)*

---

# Send emails with Ruby

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- RubyIntroductionRailsSinatra

- Python

- Go

- Rust

- Elixir

- Java

- .NET

- SMTP

- Introduction

- Rails

- Sinatra

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- 1. Install

- 2. Send email using HTML

- 3. Try it yourself

Learn how to send your first email using the Resend Ruby SDK.

## ​Prerequisites

- Create an API key

- Verify your domain

## ​1. Install

```text
gem install resend

```

## ​2. Send email using HTML

`html`
```text
require "resend"

Resend.api_key = "re_xxxxxxxxx"

params = {
  "from": "Acme <[email protected]>",
  "to": ["[email protected]"],
  "subject": "hello world",
  "html": "<strong>it works!</strong>"
}

sent = Resend::Emails.send(params)
puts sent

```

## ​3. Try it yourself

## Ruby Example

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-ruby/](https://resend.com/docs/send-with-ruby/)*

---

# Send emails with Rust

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Documentation

- Introduction

##### Quickstart

- Node.js

- Serverless

- PHP

- Ruby

- Python

- Go

- RustIntroductionAxum

- Elixir

- Java

- .NET

- SMTP

- Introduction

- Axum

##### Learn

- Sending

- Receiving

- Audience

- Domains

- Logs

- API Keys

- Broadcasts

- Templates

- Settings

##### Resources

- Examples

- SDKs

- Security

- Integrations

- Prerequisites

- Install

- Send email

- Reading the API key

- Reading the API key from a .env file

- 3. Try it yourself

Learn how to send your first email using the Resend Rust SDK.

## ​Prerequisites

- Create an API key

## ​Install

`cd`
```text
cargo init resend-rust-example
cd resend-rust-example

```

```text
cargo add resend-rs
cargo add tokio -F macros,rt-multi-thread

```

## ​Send email

```tsx
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::{Resend, Result};

#[tokio::main]
async fn main() -> Result<()> {
  let resend = Resend::new("re_xxxxxxxxx");

  let from = "Acme <[email protected]>";
  let to = ["[email protected]"];
  let subject = "Hello World";

  let email = CreateEmailBaseOptions::new(from, to, subject)
    .with_html("<strong>It works!</strong>");

  let _email = resend.emails.send(email).await?;

  Ok(())
}

```

## ​Reading the API key

`Resend::new`
`RESEND_API_KEY`
`Resend::default()`
### ​Reading the API key from a .env file

`.env`
`.env`
`dotenvy`
```text
cargo add dotenvy

```

```tsx
// main.rs
use dotenvy::dotenv;
use resend_rs::types::CreateEmailBaseOptions;
use resend_rs::{Resend, Result};

#[tokio::main]
async fn main() -> Result<()> {
  let _env = dotenv().unwrap();

  let resend = Resend::default();

  let from = "Acme <[email protected]>";
  let to = ["[email protected]"];
  let subject = "Hello World";

  let email = CreateEmailBaseOptions::new(from, to, subject)
    .with_html("<strong>It works!</strong>");

  let _email = resend.emails.send(email).await?;

  Ok(())
}

```

```markdown
# .env
RESEND_API_KEY=re_xxxxxxxxx

```

## ​3. Try it yourself

## Rust Examples

Was this page helpful?

*Fonte: [https://resend.com/docs/send-with-rust/](https://resend.com/docs/send-with-rust/)*

---

# contact.updated

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

- Event Types

- Retries and Replays

- Verify Webhooks Requests

##### Emails

- email.bounced

- email.clicked

- email.complained

- email.delivered

- email.delivery_delayed

- email.failed

- email.opened

- email.received

- email.scheduled

- email.sent

- email.suppressed

##### Domains

- domain.created

- domain.updated

- domain.deleted

##### Contacts

- contact.created

- contact.updated

- contact.deleted

```json
{
  "type": "contact.updated",
  "created_at": "2024-10-11T23:47:56.678Z",
  "data": {
    "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "segment_ids": ["78261eea-8f8b-4381-83c6-79fa7120f1cf"],
    "created_at": "2024-10-10T15:11:94.110Z",
    "updated_at": "2024-10-11T23:47:56.678Z",
    "email": "[email protected]",
    "first_name": "Steve",
    "last_name": "Wozniak",
    "unsubscribed": false
  }
}

```

Received when a contact is updated.

## Response Body Parameters

`data`
`contact.updated`
`contact.updated`
Hide object parameters

```json
{
  "type": "contact.updated",
  "created_at": "2024-10-11T23:47:56.678Z",
  "data": {
    "id": "e169aa45-1ecf-4183-9955-b1499d5701d3",
    "audience_id": "78261eea-8f8b-4381-83c6-79fa7120f1cf",
    "segment_ids": ["78261eea-8f8b-4381-83c6-79fa7120f1cf"],
    "created_at": "2024-10-10T15:11:94.110Z",
    "updated_at": "2024-10-11T23:47:56.678Z",
    "email": "[email protected]",
    "first_name": "Steve",
    "last_name": "Wozniak",
    "unsubscribed": false
  }
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/webhooks/contacts/updated/](https://resend.com/docs/webhooks/contacts/updated/)*

---

# email.bounced

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

- Event Types

- Retries and Replays

- Verify Webhooks Requests

##### Emails

- email.bounced

- email.clicked

- email.complained

- email.delivered

- email.delivery_delayed

- email.failed

- email.opened

- email.received

- email.scheduled

- email.sent

- email.suppressed

##### Domains

- domain.created

- domain.updated

- domain.deleted

##### Contacts

- contact.created

- contact.updated

- contact.deleted

```json
{
  "type": "email.bounced",
  "created_at": "2024-11-22T23:41:12.126Z",
  "data": {
    "broadcast_id": "8b146471-e88e-4322-86af-016cd36fd216",
    "created_at": "2024-11-22T23:41:11.894719+00:00",
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "subject": "Sending this example",
    "template_id": "43f68331-0622-4e15-8202-246a0388854b",
    "bounce": {
      "message": "The recipient's email address is on the suppression list because it has a recent history of producing hard bounces.",
      "subType": "Suppressed",
      "type": "Permanent"
    },
    "tags": {
      "category": "confirm_email"
    }
  }
}

```

Received when an email bounces.

## Response Body Parameters

`data`
`email.bounced`
`email.bounced`
Hide object parameters

Show tag object

Hide bounce object

`smtp; 550 5.5.0 Requested action not taken: mailbox unavailable`
`Suppressed`
`MessageRejected`
`Permanent`
`Temporary`
```json
{
  "type": "email.bounced",
  "created_at": "2024-11-22T23:41:12.126Z",
  "data": {
    "broadcast_id": "8b146471-e88e-4322-86af-016cd36fd216",
    "created_at": "2024-11-22T23:41:11.894719+00:00",
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "subject": "Sending this example",
    "template_id": "43f68331-0622-4e15-8202-246a0388854b",
    "bounce": {
      "message": "The recipient's email address is on the suppression list because it has a recent history of producing hard bounces.",
      "subType": "Suppressed",
      "type": "Permanent"
    },
    "tags": {
      "category": "confirm_email"
    }
  }
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/webhooks/emails/bounced/](https://resend.com/docs/webhooks/emails/bounced/)*

---

# email.clicked

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

- Event Types

- Retries and Replays

- Verify Webhooks Requests

##### Emails

- email.bounced

- email.clicked

- email.complained

- email.delivered

- email.delivery_delayed

- email.failed

- email.opened

- email.received

- email.scheduled

- email.sent

- email.suppressed

##### Domains

- domain.created

- domain.updated

- domain.deleted

##### Contacts

- contact.created

- contact.updated

- contact.deleted

```json
{
  "type": "email.clicked",
  "created_at": "2024-11-22T23:41:12.126Z",
  "data": {
    "broadcast_id": "8b146471-e88e-4322-86af-016cd36fd216",
    "created_at": "2024-11-22T23:41:11.894719+00:00",
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "click": {
      "ipAddress": "122.115.53.11",
      "link": "https://resend.com",
      "timestamp": "2024-11-24T05:00:57.163Z",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15"
    },
    "subject": "Sending this example",
    "template_id": "43f68331-0622-4e15-8202-246a0388854b",
    "tags": {
      "category": "confirm_email"
    }
  }
}

```

Received when an email link is clicked.

## Response Body Parameters

`data`
`email.clicked`
`email.clicked`
Hide object parameters

Show tag object

Hide click object

```json
{
  "type": "email.clicked",
  "created_at": "2024-11-22T23:41:12.126Z",
  "data": {
    "broadcast_id": "8b146471-e88e-4322-86af-016cd36fd216",
    "created_at": "2024-11-22T23:41:11.894719+00:00",
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "click": {
      "ipAddress": "122.115.53.11",
      "link": "https://resend.com",
      "timestamp": "2024-11-24T05:00:57.163Z",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15"
    },
    "subject": "Sending this example",
    "template_id": "43f68331-0622-4e15-8202-246a0388854b",
    "tags": {
      "category": "confirm_email"
    }
  }
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/webhooks/emails/clicked/](https://resend.com/docs/webhooks/emails/clicked/)*

---

# email.received

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

- Event Types

- Retries and Replays

- Verify Webhooks Requests

##### Emails

- email.bounced

- email.clicked

- email.complained

- email.delivered

- email.delivery_delayed

- email.failed

- email.opened

- email.received

- email.scheduled

- email.sent

- email.suppressed

##### Domains

- domain.created

- domain.updated

- domain.deleted

##### Contacts

- contact.created

- contact.updated

- contact.deleted

```json
{
  "type": "email.received",
  "created_at": "2024-02-22T23:41:12.126Z",
  "data": {
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "created_at": "2024-02-22T23:41:11.894719+00:00",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "bcc": [],
    "cc": [],
    "message_id": "<example+123>",
    "subject": "Sending this example",
    "attachments": [
      {
        "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
        "filename": "avatar.png",
        "content_type": "image/png",
        "content_disposition": "inline",
        "content_id": "img001"
      }
    ]
  }
}

```

Received when an inbound email is received.

## Response Body Parameters

`data`
`email.received`
`email.received`
Hide object parameters

Show tag object

```json
{
  "type": "email.received",
  "created_at": "2024-02-22T23:41:12.126Z",
  "data": {
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "created_at": "2024-02-22T23:41:11.894719+00:00",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "bcc": [],
    "cc": [],
    "message_id": "<example+123>",
    "subject": "Sending this example",
    "attachments": [
      {
        "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
        "filename": "avatar.png",
        "content_type": "image/png",
        "content_disposition": "inline",
        "content_id": "img001"
      }
    ]
  }
}

```

Was this page helpful?

*Fonte: [https://resend.com/docs/webhooks/emails/received/](https://resend.com/docs/webhooks/emails/received/)*

---

# Event Types

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

- Event Types

- Retries and Replays

- Verify Webhooks Requests

##### Emails

- email.bounced

- email.clicked

- email.complained

- email.delivered

- email.delivery_delayed

- email.failed

- email.opened

- email.received

- email.scheduled

- email.sent

- email.suppressed

##### Domains

- domain.created

- domain.updated

- domain.deleted

##### Contacts

- contact.created

- contact.updated

- contact.deleted

- Email Events

- Domain Events

- Contact Events

List of supported event types and their payload.

## ​Email Events

`email.bounced`
`email.clicked`
`email.complained`
`email.delivered`
`email.delivery_delayed`
`email.failed`
`email.opened`
`email.received`
`email.scheduled`
`email.sent`
`email.suppressed`
## ​Domain Events

`domain.created`
`domain.updated`
`domain.deleted`
## ​Contact Events

`contact.created`
`contact.updated`
`contact.deleted`
Was this page helpful?

*Fonte: [https://resend.com/docs/webhooks/event-types/](https://resend.com/docs/webhooks/event-types/)*

---

# Managing Webhooks

- Sign In

- Get Started

- Get Started

- Documentation

- API Reference

- Webhook Events

- Knowledge Base

##### Getting Started

- Introduction

- Event Types

- Retries and Replays

- Verify Webhooks Requests

##### Emails

- email.bounced

- email.clicked

- email.complained

- email.delivered

- email.delivery_delayed

- email.failed

- email.opened

- email.received

- email.scheduled

- email.sent

- email.suppressed

##### Domains

- domain.created

- domain.updated

- domain.deleted

##### Contacts

- contact.created

- contact.updated

- contact.deleted

- What is a webhook?

- Why use webhooks?

- How to receive webhooks

- 1. Create a dev endpoint to receive requests.

- 2. Add a webhook in Resend.

- 3. Test your local endpoint.

- 4. Update and deploy your production endpoint.

- 5. Register your production webhook endpoint

- FAQ

- Try it yourself

Use webhooks to notify your application about events from Resend.

## ​What is a webhook?

## ​Why use webhooks?

- Automatically remove bounced email addresses from mailing lists

- Create alerts in your messaging or incident tools based on event types

- Store all send events in your own database for custom reporting/retention

- Receive emails using Inbound

## ​How to receive webhooks

### ​1. Create a dev endpoint to receive requests.

```javascript
export default (req, res) => {
  if (req.method === 'POST') {
    const event = req.body;
    console.log(event);
    res.status(200);
  }
};

```

`HTTP 200 OK`
`https://example123.ngrok.io/api/webhook`
### ​2. Add a webhook in Resend.

- Add your publicly accessible HTTPS URL

- Select all events you want to observe

### ​3. Test your local endpoint.

```json
{
  "type": "email.bounced",
  "created_at": "2024-11-22T23:41:12.126Z",
  "data": {
    "broadcast_id": "8b146471-e88e-4322-86af-016cd36fd216",
    "created_at": "2024-11-22T23:41:11.894719+00:00",
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "from": "Acme <[email protected]>",
    "to": ["[email protected]"],
    "subject": "Sending this example",
    "template_id": "43f68331-0622-4e15-8202-246a0388854b",
    "bounce": {
      "message": "The recipient's email address is on the suppression list because it has a recent history of producing hard bounces.",
      "subType": "Suppressed",
      "type": "Permanent"
    },
    "tags": {
      "category": "confirm_email"
    }
  }
}

```

### ​4. Update and deploy your production endpoint.

```javascript

export default (req:, res) => {
  if (req.method === 'POST') {
    const event = req.body;
    if(event.type === "email.bounced"){
      //
    }
    res.status(200);
  }
};

```

### ​5. Register your production webhook endpoint

## ​FAQ

What is the retry schedule?

- 5 seconds

- 5 minutes

- 30 minutes

- 2 hours

- 5 hours

- 10 hours

What IPs do webhooks POST from?

- 44.228.126.217

- 50.112.21.217

- 52.24.126.164

- 54.148.139.208

- 2600:1f24:64:8000::/52

`44.228.126.217`
`50.112.21.217`
`52.24.126.164`
`54.148.139.208`
`2600:1f24:64:8000::/52`
Can I retry webhook events manually?

## ​Try it yourself

## Webhook Code Example

Was this page helpful?

*Fonte: [https://resend.com/docs/webhooks/introduction/](https://resend.com/docs/webhooks/introduction/)*

---

# Log in to Resend

By signing in, you agree to our Terms and Privacy Policy.

*Fonte: [https://resend.com/login/](https://resend.com/login/)*

---

# Create a Resend Account

By signing up, you agree to our Terms, Acceptable Use, and Privacy Policy.

*Fonte: [https://resend.com/signup/](https://resend.com/signup/)*

---

