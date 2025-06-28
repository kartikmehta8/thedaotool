# Organization API

Endpoints for managing bounties, contributors, and organization profiles.

{% openapi src="./openapi.yaml" path="/api/organization/bounty" method="post" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/bounty/{id}" method="delete" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/bounty/{id}" method="put" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/bounties/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/contributor/{id}" method="get" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/contributor/{id}" method="put" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/bounties/{bountyId}/unassign" method="put" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/bounties/{bountyId}/pay" method="post" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/profile/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/profile/{uid}" method="put" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/payments/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi.yaml" path="/api/organization/analytics/{uid}" method="get" %}{% endopenapi %}
