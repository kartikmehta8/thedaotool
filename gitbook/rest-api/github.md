# GitHub API

Endpoints for GitHub integration.

{% openapi src="./openapi/github.yaml" path="/api/github/auth" method="get" %}{% endopenapi %}

{% openapi src="./openapi/github.yaml" path="/api/github/callback" method="get" %}{% endopenapi %}

{% openapi src="./openapi/github.yaml" path="/api/github/repos/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi/github.yaml" path="/api/github/repo/{uid}" method="post" %}{% endopenapi %}
