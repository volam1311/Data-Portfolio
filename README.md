# Data Portfolio

Static portfolio for a second-year Computer Science and Data Science student at Queensland University of Technology. Each case study starts from a table, tests one question, and ends with a decision you can check: the baseline a model beat, the rows it would change, or the action the chart supports.

Live site: [volam1311.github.io/Data-Portfolio](https://volam1311.github.io/Data-Portfolio/)

## Case studies

| Study | Question | Stack |
| --- | --- | --- |
| [Who should Sydney Bank call first?](studies/sydney-bank.html) | Rank 1,600 customers for a 160-person call list | Python, scikit-learn |
| [Which pizzas were carrying the menu?](studies/pizza-sales.html) | One year of Maven Analytics pizza orders | Power BI, DAX |
| [Where did movie profit actually sit?](studies/movie-pipeline.html) | Weekly ELT from TMDB, with missing money stored as null | SQL, dbt, Python |
| [Which cup keeps hot water hot?](studies/cup-experiment.html) | A 2×2×3 experiment, 36 trials | R, regression |

Analysis code lives in separate repositories, linked from each study. This repo is the site that presents them.

The home page also covers education and research, the tools used in the studies, and a five-step way of working a question: frame, audit, baseline, claim, recommendation. The contact form opens the visitor’s email app. Nothing is stored on a server.

## Layout

```
index.html          Home page
studies/            One HTML page per case study
css/styles.css      Layout and type
js/main.js          Menu, case-study filters, scroll spy, contact form
assets/             Figures and favicon
.github/workflows/  GitHub Pages deploy
```

There is no build step. CSS handles the layout. JavaScript filters case studies by SQL, Python, visuals, and R, and the pages stay readable if it is turned off.

## Run locally

Open `index.html` in a browser, or serve the folder so relative links behave the same as on GitHub Pages:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Deploy

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which publishes the repository root to GitHub Pages. You can also start that workflow by hand from the Actions tab.
