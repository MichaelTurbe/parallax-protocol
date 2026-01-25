import BeastBuilderService from './BeastBuilderService.js';
import RobotBuilderService from './RobotBuilderService.js';
import SkillService from './SkillService.js';
import WeaponsService from './WeaponsService.js';

export default class DependencyService {
    #skillService: SkillService;
    #weaponsService: WeaponsService;
    #robotBuilderService: RobotBuilderService;
    #beastBuilderService: BeastBuilderService;

    constructor() {
        this.#skillService = new SkillService();
        this.#weaponsService = new WeaponsService(this.#skillService);
        this.#robotBuilderService = new RobotBuilderService(
            this.#skillService,
            this.#weaponsService
        );

        this.#beastBuilderService = new BeastBuilderService(
            this.#skillService,
            this.#weaponsService
        );
    }

    get weaponService(): WeaponsService {
        return this.#weaponsService;
    }

    get skillService(): SkillService {
        return this.#skillService;
    }

    get robotBuilderService(): RobotBuilderService {
        return this.#robotBuilderService;
    }

    get beastBuilderService(): BeastBuilderService {
        return this.#beastBuilderService;
    }
}
