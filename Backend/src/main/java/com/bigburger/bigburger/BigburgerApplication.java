package com.bigburger.bigburger;

import com.bigburger.bigburger.models.PermissionModel;
import com.bigburger.bigburger.models.RolEnum;
import com.bigburger.bigburger.models.RolModel;
import com.bigburger.bigburger.models.UserModel;
import com.bigburger.bigburger.repository.IUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Set;

@SpringBootApplication
public class BigburgerApplication {

	public static void main(String[] args) {
		SpringApplication.run(BigburgerApplication.class, args);
	}

	@Bean
	CommandLineRunner init(IUserRepository userRepository){
		return args -> {
			PermissionModel readPermission = PermissionModel.builder()
					.name("READ")
					.build();
			PermissionModel createPermission = PermissionModel.builder()
					.name("CREATE")
					.build();
			PermissionModel updatePermission = PermissionModel.builder()
					.name("UPDATE")
					.build();
			PermissionModel deletePermission = PermissionModel.builder()
					.name("DELETE")
					.build();
			PermissionModel createplusPermission = PermissionModel.builder()
					.name("CREATE_PLUS")
					.build();
			PermissionModel updateplusPermission = PermissionModel.builder()
					.name("UPDATE_PLUS")
					.build();
			PermissionModel deleteplusPermission = PermissionModel.builder()
					.name("DELETE_PLUS")
					.build();
			PermissionModel readplusPermission = PermissionModel.builder()
					.name("READ_PLUS")
					.build();
			RolModel adminRole = RolModel.builder()
					.rolEnum(RolEnum.ADMIN)
					.permissions(Set.of(createPermission,deletePermission,updatePermission,readPermission))
					.build();
			RolModel developerRole = RolModel.builder()
					.rolEnum(RolEnum.DEVELOPER)
					.permissions(Set.of(createPermission,deletePermission,updatePermission,readPermission,
							createplusPermission,deleteplusPermission,updateplusPermission,readplusPermission))
					.build();
			RolModel invitadoRole = RolModel.builder()
					.rolEnum(RolEnum.INVITADO)
					.permissions(Set.of(readPermission))
					.build();
			UserModel julian = UserModel.builder()
					.username("Julian11")
					.password(new BCryptPasswordEncoder().encode("bigBurgerEntrarAdmin2025"))
					.roles(Set.of(adminRole))
					.isEnabled(true)
					.accountNoLocked(true)
					.accountNoExpired(true)
					.credentialNoExpired(true)
					.build();
			UserModel joaquin = UserModel.builder()
					.username("Hoselot")
					.password(new BCryptPasswordEncoder().encode("bigBurgerEntrarDeveloper2025"))
					.roles(Set.of(developerRole))
					.isEnabled(true)
					.accountNoLocked(true)
					.accountNoExpired(true)
					.credentialNoExpired(true)
					.build();
			UserModel emiliano = UserModel.builder()
					.username("EmiArias")
					.password(new BCryptPasswordEncoder().encode("bigBurgerEntrarDeveloper2025"))
					.roles(Set.of(developerRole))
					.isEnabled(true)
					.accountNoLocked(true)
					.accountNoExpired(true)
					.credentialNoExpired(true)
					.build();
			UserModel invitado = UserModel.builder()
					.username("Invitado")
					.password(new BCryptPasswordEncoder().encode("bigBurgerEntrarInvitado2025"))
					.roles(Set.of(invitadoRole))
					.isEnabled(true)
					.accountNoLocked(true)
					.accountNoExpired(true)
					.credentialNoExpired(true)
					.build();

			userRepository.saveAll(List.of(joaquin,emiliano,julian,invitado));
		};
	}
}
