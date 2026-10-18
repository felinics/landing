# Is Connector authorization safe?

Help Center › Privacy & security · https://memoh.ai/help/privacy-security/connector-security

Connectors use each service's official authorization flow (e.g. OAuth):

- authorized **per service**, never bundled.
- requesting only the minimum scopes needed for the job.
- credentials stored encrypted, and **revocable in the Supermarket at any time**.

Once revoked, the agent immediately loses access to that service.
