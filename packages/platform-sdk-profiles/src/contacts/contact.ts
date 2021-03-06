import { pqueue } from "../helpers/queue";
import { Profile } from "../profiles/profile";
import { ContactAddressRepository } from "../repositories/contact-address-repository";
import { Avatar } from "../services/avatar";
import { ContactStruct } from "./contact.models";
import { ContactAddressInput } from "./contact-address.models";

export class Contact {
	#profile: Profile;

	readonly #id: string;
	#name: string;
	#addresses: ContactAddressRepository = new ContactAddressRepository();
	#starred: boolean;

	#avatar: string;

	public constructor({ id, name, starred }: ContactStruct, profile: Profile) {
		this.#profile = profile;

		this.#id = id;
		this.#name = name;
		this.#starred = starred;

		this.#avatar = Avatar.make(name);
	}

	public async restore(addresses: object[]): Promise<void> {
		await this.#addresses.fill(addresses);
	}

	public id(): string {
		return this.#id;
	}

	public name(): string {
		return this.#name;
	}

	public addresses(): ContactAddressRepository {
		return this.#addresses;
	}

	public isStarred(): boolean {
		return this.#starred;
	}

	public toggleStarred(): void {
		this.#starred = !this.isStarred();
	}

	public setAvatar(value: string): void {
		this.#avatar = value;
	}

	public setName(name: string): void {
		this.#name = name;

		this.setAvatar(Avatar.make(name));
	}

	public async setAddresses(addresses: ContactAddressInput[]): Promise<void> {
		this.#addresses.flush();

		await pqueue(addresses.map((address: ContactAddressInput) => () => this.#addresses.create(address)));
	}

	public avatar(): string {
		return this.#avatar;
	}

	public toObject(): ContactStruct {
		return {
			id: this.id(),
			name: this.name(),
			starred: this.isStarred(),
			addresses: this.addresses().toArray(),
		};
	}
}
