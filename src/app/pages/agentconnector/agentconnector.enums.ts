export enum AgentconnectorWizardStepsEnum {
    SelectHost = 'SelectHost',
    ConfigureAgent = 'ConfigureAgent',
    InstallAgent = 'InstallAgent',
    AutoTls = 'AutoTls',
    CreateServices = 'CreateServices',
}

export enum AgentconnectorOperatingSystems {
    Windows = 'windows',
    Linux = 'linux',
    Macos = 'macos',
}

export enum AgentconnectorWebserverTypes {
    Http = 'http',
    Https = 'https',
}

export enum AgentconnectorConnectionTypes {
    Http = 'http',
    Https = 'https',
    AutoTls = 'autotls',
}


export enum AgentHttpClientErrors {
    //No errors
    ERRNO_OK = 0,

    // Agent should only respond to HTTPS requests because of sucessfull AutoTLS in the past
    // but the agent response to HTTP requests. So the cert file got delete on the Agent.
    ERRNO_AGENT_RESPONSES_TO_HTTP = 1 << 0,

    // The Agent is configured to only use HTTP
    ERRNO_AGENT_USES_ONLY_HTTP = 1 << 1,

    // AutoTLS certificates got exchanged successfully in the past but now the Cert from the oITC Server
    // mismatches the cert from the Agent. System mybe compromised
    ERRNO_HTTPS_COMPROMISED = 1 << 2,

    // Error while sending agent certificate to the Agent
    ERRNO_EXCHANGE_HTTPS_CERTIFICATE = 1 << 3,

    // No json response from agent or missing fields
    ERRNO_BAD_AGENT_RESPONSE = 1 << 4,

    // Unknown error
    ERRNO_UNKNOWN = 1 << 5,

    // Error while creating HTTPS connection
    ERRNO_HTTPS_ERROR = 1 << 6,

    // Error while creating insecure HTTP connection
    ERRNO_HTTP_ERROR = 1 << 7,
}

export enum AgentconnectorSatelliteTaskStatus {
    SatelliteTaskFinishedSuccessfully = 4,
    SatelliteTaskFinishedError = 8
}
