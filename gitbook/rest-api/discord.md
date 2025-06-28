# Discord API

Integration with Discord.

{% openapi src="./openapi/discord.yaml" path="/api/discord/oauth" method="get" %}{% endopenapi %}

{% openapi src="./openapi/discord.yaml" path="/api/discord/callback" method="get" %}{% endopenapi %}

{% openapi src="./openapi/discord.yaml" path="/api/discord/channels/{uid}" method="get" %}{% endopenapi %}

{% openapi src="./openapi/discord.yaml" path="/api/discord/channel/{uid}" method="put" %}{% endopenapi %}
