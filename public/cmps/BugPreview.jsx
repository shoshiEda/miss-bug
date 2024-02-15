

export function BugPreview({bug}) {

    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Created at: <span>{new Date(bug.createdAt).toLocaleString()}</span></p>
        {bug.creator && <p>creator: <span>{bug.creator.fullname}</span></p>}


    </article>
}