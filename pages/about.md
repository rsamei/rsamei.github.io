---
layout: page
title: About
permalink: /about/
weight: 1
---

# **About Me** 
 {% include elements/button.html link="/assets/cv.pdf" text="Download CV" style="success" size="sm" %}

I am **{{ site.author.name }}** :wave:,<br>
I'm an enthusiastic data analyst with a master’s degree in Economics and Data Analysis from Università degli Studi di Bergamo. With a solid foundation in business management and hands-on experience in data analysis, I have been developing my skills in areas like machine learning, data visualization, and database management. In addition to my academic and professional journey, my proficiency in programming languages such as Python and R, along with my ability to effectively communicate findings, position me as a valuable contributor to data-driven decision-making processes.

<div class="row">
{% include about/skills.html title="Tools" source=site.data.CnC %}
{% include about/skills.html title="Data Frameworks/Libraries" source=site.data.Data-Analysis-and-Visualization %}
</div>
<div class="row">
{% include about/skills.html title="Machine/Deep Learning" source=site.data.ML %}
{% include about/skills.html title="Office" source=site.data.office %}
</div>
<div class="row">
{% include about/skills.html title="Programming Languages" source=site.data.programming-skills %}
{% include about/skills.html title="Data Base Management" source=site.data.Data-Base %}


</div>

