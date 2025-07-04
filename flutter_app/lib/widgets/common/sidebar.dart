import 'package:flutter/material.dart';
import 'package:flutter_app/services/auth_service.dart';
import 'package:google_fonts/google_fonts.dart';

class Sidebar extends StatefulWidget {
  final AuthService authService;
  final VoidCallback onHomePressed;
  final VoidCallback onGenresPressed;
  final VoidCallback onFavoritesPressed;
  final VoidCallback onRecommendationsPressed;
  final VoidCallback onRatingsPressed;
  final VoidCallback onProfilPressed;
  final VoidCallback onLoginPressed;
  final VoidCallback onLogoutPressed;
  final String currentPage;

  static bool isExpandedGlobal = true;

  const Sidebar({
    required this.authService,
    required this.onHomePressed,
    required this.onGenresPressed,
    required this.onFavoritesPressed,
    required this.onRecommendationsPressed,
    required this.onRatingsPressed,
    required this.onProfilPressed,
    required this.onLoginPressed,
    required this.onLogoutPressed,
    required this.currentPage,
    super.key,
  });

  @override
  _SidebarState createState() => _SidebarState();
}

class _SidebarState extends State<Sidebar> {
  late bool isExpanded;
  bool isBurgerHovered = false;

  @override
  void initState() {
    super.initState();
    isExpanded = Sidebar.isExpandedGlobal;
  }

  void toggleSidebar() {
    setState(() {
      isExpanded = !isExpanded;
      Sidebar.isExpandedGlobal = isExpanded;
    });
  }

  Widget buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    bool isSelected = widget.currentPage == title;
    return HoverMenuItem(
      icon: icon,
      title: title,
      isSelected: isSelected,
      isExpanded: isExpanded,
      onTap: onTap,
    );
  }

  Widget buildSidebarContent() {
    return ValueListenableBuilder<bool>(
      valueListenable: widget.authService.isLoggedIn,
      builder: (context, isLoggedIn, _) {
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: isExpanded
                    ? MainAxisAlignment.start
                    : MainAxisAlignment.center,
                children: [
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: isExpanded ? "CineCritique" : "CC",
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextSpan(
                          text: ".",
                          style: GoogleFonts.inter(
                            color: Colors.redAccent,
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            buildMenuItem(
              icon: Icons.home_outlined,
              title: "Home",
              onTap: widget.onHomePressed,
            ),
            buildMenuItem(
              icon: Icons.category_outlined,
              title: "Genres",
              onTap: widget.onGenresPressed,
            ),
            if (isLoggedIn) ...[
              buildMenuItem(
                icon: Icons.favorite_outline,
                title: "Favoriten",
                onTap: widget.onFavoritesPressed,
              ),
              buildMenuItem(
                icon: Icons.star_outline,
                title: "Bewertungen",
                onTap: widget.onRatingsPressed,
              ),
              buildMenuItem(
                icon: Icons.lightbulb_outline,
                title: "Empfehlungen",
                onTap: widget.onRecommendationsPressed,
              ),
              buildMenuItem(
                icon: Icons.account_circle_outlined,
                title: "Profil",
                onTap: widget.onProfilPressed,
              ),
            ],
            const Spacer(),
            buildMenuItem(
              icon: isLoggedIn ? Icons.logout : Icons.login,
              title: isLoggedIn ? "Abmelden" : "Anmelden",
              onTap: () async {
                if (isLoggedIn) {
                  widget.onLogoutPressed();
                } else {
                  widget.onLoginPressed();
                }
              },
            ),
            if (!isMobile(context))
              Align(
                alignment:
                    isExpanded ? Alignment.centerRight : Alignment.center,
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  onEnter: (_) => setState(() => isBurgerHovered = true),
                  onExit: (_) => setState(() => isBurgerHovered = false),
                  child: IconButton(
                    icon: Icon(
                      isExpanded ? Icons.arrow_back : Icons.arrow_forward,
                      color: isBurgerHovered ? Colors.red : Colors.redAccent,
                    ),
                    onPressed: toggleSidebar,
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < 600;

  @override
  Widget build(BuildContext context) {
    if (isMobile(context)) {
      return Drawer(
        width: 250,
        child: Container(
          color: const Color(0xFF121212),
          child: buildSidebarContent(),
        ),
      );
    }
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: isExpanded ? 250 : 100,
      color: const Color(0xFF121212),
      child: buildSidebarContent(),
    );
  }
}

class HoverMenuItem extends StatefulWidget {
  final IconData icon;
  final String title;
  final bool isSelected;
  final bool isExpanded;
  final VoidCallback onTap;

  const HoverMenuItem({
    Key? key,
    required this.icon,
    required this.title,
    required this.isSelected,
    required this.isExpanded,
    required this.onTap,
  }) : super(key: key);

  @override
  _HoverMenuItemState createState() => _HoverMenuItemState();
}

class _HoverMenuItemState extends State<HoverMenuItem> {
  bool isHovered = false;

  @override
  Widget build(BuildContext context) {
    Color color =
        (widget.isSelected || isHovered) ? Colors.redAccent : Colors.white;
    return Material(
      type: MaterialType.transparency,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => isHovered = true),
        onExit: (_) => setState(() => isHovered = false),
        child: GestureDetector(
          onTap: widget.onTap,
          child: Container(
            padding:
                const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            child: Row(
              mainAxisAlignment: widget.isExpanded
                  ? MainAxisAlignment.start
                  : MainAxisAlignment.center,
              children: [
                Padding(
                  padding: EdgeInsets.only(left: widget.isExpanded ? 24 : 0),
                  child: Icon(widget.icon, color: color, size: 24),
                ),
                if (widget.isExpanded)
                  Padding(
                    padding: const EdgeInsets.only(left: 32),
                    child: Text(
                      widget.title,
                      style: GoogleFonts.inter(color: color, fontSize: 16),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
