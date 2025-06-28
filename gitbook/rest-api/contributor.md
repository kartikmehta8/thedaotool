# Contributor API

Endpoints for contributor operations.

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/apply" method="post" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/submit" method="post" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/bounties/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/profile/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/profile/{uid}" method="put" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/unassign" method="put" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/payments/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi/contributor.yaml" path="/api/contributor/analytics/{uid}" method="get" %}{% endopenapi %}
