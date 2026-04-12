export class ParallaxItem extends Item {
    prepareBaseData() {
        super.prepareBaseData();

        if (this.type !== "weapon") return;

        const system = this.system;
        system.damageClass ??= "kinetic";

        const validTypes = system.damageClass === "energy"
            ? ["f", "c", "a", "e"]
            : ["p", "s", "b"];

        if (!validTypes.includes(system.damageType)) {
            system.damageType = validTypes[0];
        }
    }
}
