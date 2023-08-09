export function removeNullPipelineStage<PipelineStage>(stage: PipelineStage | null): stage is PipelineStage {
    return stage != null
}

export function removeNull<T>(stage: T | null): stage is T {
    return stage != null
}
