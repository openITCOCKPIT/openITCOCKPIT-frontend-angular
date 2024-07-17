// The result of the /nagios_module/cmd/index.json API endpoint can be anything.

export interface ExternalCommandDefinitionRoot {
    [key: string]: ExternalCommandDefinition
}

export interface ExternalCommandDefinition {
    [key: string]: null | string | number
}
