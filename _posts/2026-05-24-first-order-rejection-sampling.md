---
layout: distill
title: First Order Rejection Sampling
description: An introduction to first-order rejection sampling and its connections to diffusion-based generative models
date: 2026-05-24

authors:
  - name: Xunpeng Huang
    url: "https://xunpeng746.github.io"
    affiliations:
      name: HKUST

bibliography: blog_ref.bib

---

## Introduction

Rejection sampling is a classical Monte Carlo technique for drawing samples from a target distribution $p(x)$ when direct sampling is difficult. The idea is to sample from a simpler proposal distribution $q(x)$ and accept or reject each sample based on a likelihood ratio test.

**First-order rejection sampling** extends this idea by incorporating gradient information (first-order derivatives) of the log-target density, leading to tighter proposals and higher acceptance rates.

## Background: Standard Rejection Sampling

Given a target $$p(x) \propto \tilde{p}(x)$$ and a proposal $$q(x)$$ such that $\tilde{p}(x) \leq M \cdot q(x)$ for all $x$ and some constant $M < \infty$, the standard algorithm is:

1. Sample $x \sim q(x)$
2. Sample $u \sim \text{Uniform}(0, 1)$
3. Accept $x$ if $u \leq \dfrac{\tilde{p}(x)}{M \cdot q(x)}$, otherwise reject

The acceptance rate is $1/M$, so a tight proposal (small $M$) is critical for efficiency.

## First-Order Extensions

The key bottleneck of standard rejection sampling is constructing a good global upper bound $M$. First-order methods replace this with a *local* bound that uses gradient information $\nabla \log p(x)$ to adapt the envelope near each proposed sample.

### Locally-Adaptive Envelopes

Let $f(x) = \log \tilde{p}(x)$. If $f$ is concave (log-concave target), the tangent hyperplane at any point $x_0$ gives a valid upper bound:

$$f(x) \leq f(x_0) + \nabla f(x_0)^\top (x - x_0)$$

This is the basis of the **Adaptive Rejection Sampling (ARS)** algorithm for log-concave distributions. Each rejection refines the piecewise-linear envelope, progressively tightening the bound.

## Connection to Langevin Dynamics

First-order rejection sampling shares a deep connection with score-based methods. The score function $\nabla_x \log p(x)$ plays the same role in both:

- In **Langevin MCMC**, the score drives the drift term of the SDE
- In **first-order rejection sampling**, the score constructs local upper bounds

This connection motivates hybrid algorithms that combine the high acceptance rates of rejection sampling with the scalability of score-based diffusion models.

## Algorithm

The general first-order rejection sampling procedure is:

1. Propose $x \sim q(\cdot \mid x_t)$ from a local proposal centered at the current state
2. Evaluate $\nabla \log p(x)$ at the proposed point
3. Construct a local bound $M(x, x_t)$ using the gradient
4. Accept with probability $\min\!\left(1,\, \dfrac{\tilde{p}(x)}{M(x,\, x_t) \cdot q(x \mid x_t)}\right)$

The gradient-informed bound $M(x, x_t)$ is typically much tighter than any global constant $M$, yielding significantly higher acceptance rates.

## Conclusion

First-order rejection sampling bridges classical Monte Carlo theory and modern gradient-based sampling. By leveraging score function evaluations — already central to diffusion model training — it offers a principled way to improve sample quality with only modest additional cost.

