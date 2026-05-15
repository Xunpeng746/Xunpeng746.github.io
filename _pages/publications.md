---
layout: page
permalink: /publications/
title: publications
years: [2026, 2025, 2024, 2021, 2020, 2018, 2017]
nav: true
nav_order: 2
---

<div class="publications">

{% for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
