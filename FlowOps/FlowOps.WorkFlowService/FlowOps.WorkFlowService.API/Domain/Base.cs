


namespace FlowOps.WorkFlowService.Domain;

public class BaseEntity  {
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    
    public  BaseEntity() {
        Id = Guid.NewGuid();
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public void Delete() {
        DeletedAt = DateTimeOffset.UtcNow;
    }

    public void Update() {
        UpdatedAt = DateTimeOffset.UtcNow;
    }   

    public bool IsDeleted() {
        return DeletedAt.HasValue;
    }
}