export function UseDto(dtoClass): ClassDecorator {
  return (ctor) => {
    // FIXME make dtoClass function returning dto
    ctor.prototype.dtoClass = dtoClass;
  };
}
