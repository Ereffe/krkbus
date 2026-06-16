package pk.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pk.backend.dto.auth.AuthResponse;
import pk.backend.dto.auth.LoginRequest;
import pk.backend.dto.auth.RegisterRequest;
import pk.backend.entity.user.Client;
import pk.backend.entity.user.User;
import pk.backend.entity.user.UserProfile;
import pk.backend.repository.ClientRepository;
import pk.backend.repository.UserProfileRepository;
import pk.backend.repository.UserRepository;
import pk.backend.service.JwtService;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<pk.backend.dto.auth.RegisterResponse> register(@RequestBody RegisterRequest request) {
        String baseLogin = request.getFirstName().toLowerCase().replaceAll("[^a-z]", "") + "." + request.getLastName().toLowerCase().replaceAll("[^a-z]", "");
        String generatedLogin = baseLogin;
        int counter = 1;
        while (userRepository.findByLogin(generatedLogin).isPresent()) {
            generatedLogin = baseLogin + counter;
            counter++;
        }

        String generatedPassword = UUID.randomUUID().toString().substring(0, 8);

        UserProfile profile = new UserProfile();
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        userProfileRepository.save(profile);

        Client client = new Client();
        client.setLogin(generatedLogin);
        client.setPassword(passwordEncoder.encode(generatedPassword));
        client.setRole("USER");
        client.setStatus("ACTIVE");
        client.setProfile(profile);
        client.setClientNumber("CL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        client.setLoyaltyPoints(0);

        clientRepository.save(client);

        var userDetails = new org.springframework.security.core.userdetails.User(
                client.getLogin(), client.getPassword(), 
                java.util.Collections.singleton(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"))
        );
        var jwtToken = jwtService.generateToken(userDetails);

        System.out.println("Wysłano e-mail aktywacyjny na adres: " + request.getEmail());
        
        return ResponseEntity.ok(new pk.backend.dto.auth.RegisterResponse(
                client.getLogin(),
                generatedPassword,
                client.getClientNumber(),
                jwtToken,
                client.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()
                )
        );
        
        var user = userRepository.findByLogin(request.getLogin())
                .orElseThrow();
                
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getLogin(), user.getPassword(), 
                java.util.Collections.singleton(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + (user.getRole() != null ? user.getRole().trim().toUpperCase() : "")
                ))
        );
        
        var jwtToken = jwtService.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(jwtToken, user.getRole(), user.getUserID()));
    }
}

